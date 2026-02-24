import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, ILike } from 'typeorm';
import { Agent, AgentStatus } from '../../entities/agent.entity';
import { SearchHistory, HotSearch } from '../../entities/search-history.entity';
import {
  SearchAgentsDto, SearchResponseDto, SearchResultItemDto,
  SearchHistoryDto, HotSearchDto, SearchSuggestResponseDto,
  SortBy, ClearSearchHistoryDto
} from '../dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    @InjectRepository(HotSearch)
    private readonly hotSearchRepository: Repository<HotSearch>,
  ) {}

  /**
   * 全文搜索Agent
   */
  async search(userId: string | null, dto: SearchAgentsDto): Promise<SearchResponseDto> {
    const startTime = Date.now();
    const { 
      keyword, category_id, tags, price_min, price_max, 
      rating_min, pricing_models, free_only, sort_by,
      page = 1, limit = 20 
    } = dto;

    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.status = :status', { status: AgentStatus.ACTIVE });

    // 关键词搜索（名称、描述、标签）
    if (keyword) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('agent.name ILIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('agent.description ILIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('agent.tags::text ILIKE :keyword', { keyword: `%${keyword}%` });
        })
      );
    }

    // 分类筛选
    // if (category_id) {
    //   queryBuilder.andWhere('agent.category_id = :category_id', { category_id });
    // }

    // 标签筛选
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('agent.tags && :tags', { tags });
    }

    // 价格筛选
    if (price_min !== undefined) {
      queryBuilder.andWhere('agent.cost_per_call >= :price_min', { price_min });
    }
    if (price_max !== undefined) {
      queryBuilder.andWhere('agent.cost_per_call <= :price_max', { price_max });
    }

    // 评分筛选
    if (rating_min !== undefined) {
      queryBuilder.andWhere('agent.value_score >= :rating_min', { rating_min });
    }

    // 定价模式筛选
    if (pricing_models && pricing_models.length > 0) {
      queryBuilder.andWhere('agent.pricing_model IN (:...pricing_models)', { pricing_models });
    }

    // 只显示免费
    if (free_only) {
      queryBuilder.andWhere("agent.pricing_model = 'free'");
    }

    // 排序
    switch (sort_by) {
      case SortBy.PRICE_ASC:
        queryBuilder.orderBy('agent.cost_per_call', 'ASC');
        break;
      case SortBy.PRICE_DESC:
        queryBuilder.orderBy('agent.cost_per_call', 'DESC');
        break;
      case SortBy.RATING:
        queryBuilder.orderBy('agent.value_score', 'DESC');
        break;
      case SortBy.SALES:
        queryBuilder.orderBy('agent.total_executions', 'DESC');
        break;
      case SortBy.NEWEST:
        queryBuilder.orderBy('agent.created_at', 'DESC');
        break;
      case SortBy.POPULARITY:
        queryBuilder.orderBy('agent.total_executions', 'DESC');
        break;
      case SortBy.RELEVANCE:
      default:
        // 相关性排序：优先匹配名称
        if (keyword) {
          queryBuilder.addOrderBy(
            `CASE WHEN agent.name ILIKE :exactKeyword THEN 0 
                  WHEN agent.name ILIKE :startKeyword THEN 1 
                  ELSE 2 END`,
            'ASC'
          );
          queryBuilder.setParameter('exactKeyword', keyword);
          queryBuilder.setParameter('startKeyword', `${keyword}%`);
        }
        queryBuilder.addOrderBy('agent.value_score', 'DESC');
        break;
    }

    // 分页
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [agents, total] = await queryBuilder.getManyAndCount();

    // 记录搜索历史
    if (userId && keyword) {
      await this.recordSearchHistory(userId, keyword, dto, total);
    }

    // 更新热门搜索
    if (keyword) {
      await this.updateHotSearch(keyword);
    }

    const took = Date.now() - startTime;

    return {
      data: agents.map(agent => this.toSearchResult(agent, keyword)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      took,
      related_keywords: await this.getRelatedKeywords(keyword)
    };
  }

  /**
   * 搜索建议
   */
  async suggest(keyword: string): Promise<SearchSuggestResponseDto> {
    const suggestions: string[] = [];

    if (keyword) {
      // 从Agent名称中获取建议
      const agents = await this.agentRepository.find({
        where: { 
          name: ILike(`%${keyword}%`),
          status: AgentStatus.ACTIVE
        },
        take: 5,
        select: ['name']
      });
      suggestions.push(...agents.map(a => a.name));

      // 从搜索历史中获取建议
      const histories = await this.hotSearchRepository.find({
        where: { 
          keyword: ILike(`%${keyword}%`),
          is_active: true
        },
        take: 5,
        order: { score: 'DESC' }
      });
      suggestions.push(...histories.map(h => h.keyword));
    }

    // 获取热门搜索
    const hotSearches = await this.getHotSearches();

    return {
      suggestions: [...new Set(suggestions)].slice(0, 10),
      hot_searches: hotSearches
    };
  }

  /**
   * 获取热门搜索
   */
  async getHotSearches(limit: number = 10): Promise<HotSearchDto[]> {
    const hotSearches = await this.hotSearchRepository.find({
      where: { is_active: true },
      order: { score: 'DESC' },
      take: limit
    });

    return hotSearches.map(hs => ({
      keyword: hs.keyword,
      search_count: hs.search_count,
      is_promoted: hs.is_promoted
    }));
  }

  /**
   * 获取用户搜索历史
   */
  async getUserHistory(userId: string, limit: number = 20): Promise<SearchHistoryDto[]> {
    const histories = await this.searchHistoryRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit
    });

    return histories.map(h => ({
      id: h.id,
      keyword: h.keyword,
      result_count: h.result_count,
      created_at: h.created_at
    }));
  }

  /**
   * 清除搜索历史
   */
  async clearHistory(userId: string, dto?: ClearSearchHistoryDto): Promise<void> {
    if (dto?.ids && dto.ids.length > 0) {
      await this.searchHistoryRepository.delete({
        user_id: userId,
        id: In(dto.ids)
      });
    } else {
      await this.searchHistoryRepository.delete({ user_id: userId });
    }
  }

  /**
   * 记录搜索历史
   */
  private async recordSearchHistory(
    userId: string, 
    keyword: string, 
    filters: SearchAgentsDto,
    resultCount: number
  ): Promise<void> {
    const history = this.searchHistoryRepository.create({
      user_id: userId,
      keyword,
      filters: {
        category_id: filters.category_id,
        price_min: filters.price_min,
        price_max: filters.price_max,
        rating_min: filters.rating_min,
        tags: filters.tags
      },
      result_count: resultCount
    });
    await this.searchHistoryRepository.save(history);
  }

  /**
   * 更新热门搜索
   */
  private async updateHotSearch(keyword: string): Promise<void> {
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    let hotSearch = await this.hotSearchRepository.findOne({
      where: { keyword: normalizedKeyword }
    });

    if (hotSearch) {
      hotSearch.search_count += 1;
      hotSearch.last_searched_at = new Date();
      hotSearch.score = this.calculateHotScore(hotSearch);
    } else {
      hotSearch = this.hotSearchRepository.create({
        keyword: normalizedKeyword,
        search_count: 1,
        last_searched_at: new Date(),
        score: 1
      });
    }

    await this.hotSearchRepository.save(hotSearch);
  }

  /**
   * 计算热度分数
   */
  private calculateHotScore(hotSearch: HotSearch): number {
    const now = Date.now();
    const lastSearched = new Date(hotSearch.last_searched_at).getTime();
    const hoursSinceLastSearch = (now - lastSearched) / (1000 * 60 * 60);
    
    // 时间衰减 + 搜索次数
    const timeDecay = Math.exp(-hoursSinceLastSearch / 24);
    return hotSearch.search_count * timeDecay + (hotSearch.click_count * 2);
  }

  /**
   * 获取相关搜索词
   */
  private async getRelatedKeywords(keyword?: string): Promise<string[]> {
    if (!keyword) return [];

    const related = await this.hotSearchRepository.find({
      where: { 
        keyword: ILike(`%${keyword.substring(0, 3)}%`),
        is_active: true
      },
      take: 5,
      order: { score: 'DESC' }
    });

    return related
      .filter(r => r.keyword !== keyword.toLowerCase())
      .map(r => r.keyword);
  }

  private toSearchResult(agent: Agent, keyword?: string): SearchResultItemDto {
    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      avatar_url: agent.avatar_url,
      pricing_model: agent.pricing_model,
      cost_per_call: Number(agent.cost_per_call),
      value_score: Number(agent.value_score),
      total_executions: agent.total_executions,
      tags: agent.tags || [],
      creator_name: agent.creator?.username || 'Unknown',
      relevance_score: this.calculateRelevance(agent, keyword)
    };
  }

  private calculateRelevance(agent: Agent, keyword?: string): number {
    if (!keyword) return 1;
    
    const lowerKeyword = keyword.toLowerCase();
    let score = 0;

    if (agent.name.toLowerCase() === lowerKeyword) score += 100;
    else if (agent.name.toLowerCase().startsWith(lowerKeyword)) score += 50;
    else if (agent.name.toLowerCase().includes(lowerKeyword)) score += 30;

    if (agent.description?.toLowerCase().includes(lowerKeyword)) score += 10;
    if (agent.tags?.some(t => t.toLowerCase().includes(lowerKeyword))) score += 20;

    return score;
  }
}

function In(ids: string[]): any {
  return { $in: ids };
}
