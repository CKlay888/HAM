import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Agent, AgentStatus } from '../../entities/agent.entity';
import { Favorite } from '../../entities/favorite.entity';
import { Execution } from '../../entities/execution.entity';
import {
  GetRecommendDto, GetSimilarAgentsDto, PersonalizedRecommendDto,
  RecommendResponseDto, RecommendItemDto, HomeRecommendResponseDto,
  RecordBehaviorDto, RecommendType
} from '../dto/recommend.dto';

@Injectable()
export class RecommendService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Execution)
    private readonly executionRepository: Repository<Execution>,
  ) {}

  /**
   * 获取推荐列表
   */
  async getRecommend(dto: GetRecommendDto): Promise<RecommendResponseDto> {
    const { type = RecommendType.HOT, category_id, limit = 10 } = dto;

    let agents: Agent[] = [];

    switch (type) {
      case RecommendType.HOT:
        agents = await this.getHotAgents(category_id, limit);
        break;
      case RecommendType.NEW:
        agents = await this.getNewAgents(category_id, limit);
        break;
      case RecommendType.TRENDING:
        agents = await this.getTrendingAgents(category_id, limit);
        break;
      default:
        agents = await this.getHotAgents(category_id, limit);
    }

    return {
      data: agents.map(a => this.toRecommendItem(a, type)),
      type,
      total: agents.length
    };
  }

  /**
   * 首页推荐
   */
  async getHomeRecommend(userId?: string): Promise<HomeRecommendResponseDto> {
    const [hot, newAgents, trending] = await Promise.all([
      this.getHotAgents(null, 8),
      this.getNewAgents(null, 8),
      this.getTrendingAgents(null, 8)
    ]);

    let personalized: Agent[] = [];
    if (userId) {
      personalized = await this.getPersonalizedAgents(userId, { limit: 8 });
    }

    return {
      hot: hot.map(a => this.toRecommendItem(a, RecommendType.HOT)),
      new: newAgents.map(a => this.toRecommendItem(a, RecommendType.NEW)),
      trending: trending.map(a => this.toRecommendItem(a, RecommendType.TRENDING)),
      personalized: personalized.length > 0 
        ? personalized.map(a => this.toRecommendItem(a, RecommendType.PERSONALIZED))
        : undefined
    };
  }

  /**
   * 个性化推荐
   */
  async getPersonalized(
    userId: string, 
    dto: PersonalizedRecommendDto
  ): Promise<RecommendResponseDto> {
    const agents = await this.getPersonalizedAgents(userId, dto);

    return {
      data: agents.map(a => this.toRecommendItem(a, RecommendType.PERSONALIZED)),
      type: RecommendType.PERSONALIZED,
      total: agents.length
    };
  }

  /**
   * 相似Agent推荐
   */
  async getSimilar(dto: GetSimilarAgentsDto): Promise<RecommendResponseDto> {
    const { agent_id, limit = 10 } = dto;

    const agent = await this.agentRepository.findOne({
      where: { id: agent_id }
    });

    if (!agent) {
      return { data: [], type: RecommendType.SIMILAR, total: 0 };
    }

    // 基于标签和分类的相似推荐
    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.id != :agentId', { agentId: agent_id })
      .andWhere('agent.status = :status', { status: AgentStatus.ACTIVE });

    // 相同标签
    if (agent.tags && agent.tags.length > 0) {
      queryBuilder.andWhere('agent.tags && :tags', { tags: agent.tags });
    }

    queryBuilder.orderBy('agent.value_score', 'DESC');
    queryBuilder.take(limit);

    const similarAgents = await queryBuilder.getMany();

    return {
      data: similarAgents.map(a => this.toRecommendItem(a, RecommendType.SIMILAR)),
      type: RecommendType.SIMILAR,
      total: similarAgents.length
    };
  }

  /**
   * 购买此商品的人还买了
   */
  async getBoughtAlso(agentId: string, limit: number = 10): Promise<RecommendResponseDto> {
    // 找到购买过此Agent的用户
    const executions = await this.executionRepository.find({
      where: { agent_id: agentId },
      select: ['account_id'],
      take: 100
    });

    const userIds = [...new Set(executions.map(e => e.account_id))];

    if (userIds.length === 0) {
      return { data: [], type: RecommendType.BOUGHT_ALSO, total: 0 };
    }

    // 找这些用户还购买了什么
    const otherExecutions = await this.executionRepository
      .createQueryBuilder('exec')
      .select('exec.agent_id')
      .addSelect('COUNT(*)', 'count')
      .where('exec.account_id IN (:...userIds)', { userIds })
      .andWhere('exec.agent_id != :agentId', { agentId })
      .groupBy('exec.agent_id')
      .orderBy('count', 'DESC')
      .take(limit)
      .getRawMany();

    const agentIds = otherExecutions.map(e => e.agent_id);
    
    if (agentIds.length === 0) {
      return { data: [], type: RecommendType.BOUGHT_ALSO, total: 0 };
    }

    const agents = await this.agentRepository.find({
      where: { 
        id: In(agentIds),
        status: AgentStatus.ACTIVE
      },
      relations: ['creator']
    });

    return {
      data: agents.map(a => this.toRecommendItem(a, RecommendType.BOUGHT_ALSO)),
      type: RecommendType.BOUGHT_ALSO,
      total: agents.length
    };
  }

  /**
   * 记录用户行为（用于推荐）
   */
  async recordBehavior(userId: string, dto: RecordBehaviorDto): Promise<void> {
    // TODO: 实现行为记录存储
    // 可以存储到Redis或专门的行为表中
    // 用于后续的个性化推荐
    console.log(`User ${userId} behavior: ${dto.behavior_type} on agent ${dto.agent_id}`);
  }

  /**
   * 获取热门Agent
   */
  private async getHotAgents(categoryId: string | null, limit: number): Promise<Agent[]> {
    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.status = :status', { status: AgentStatus.ACTIVE });

    // if (categoryId) {
    //   queryBuilder.andWhere('agent.category_id = :categoryId', { categoryId });
    // }

    queryBuilder.orderBy('agent.total_executions', 'DESC');
    queryBuilder.addOrderBy('agent.value_score', 'DESC');
    queryBuilder.take(limit);

    return queryBuilder.getMany();
  }

  /**
   * 获取新品Agent
   */
  private async getNewAgents(categoryId: string | null, limit: number): Promise<Agent[]> {
    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.status = :status', { status: AgentStatus.ACTIVE });

    // if (categoryId) {
    //   queryBuilder.andWhere('agent.category_id = :categoryId', { categoryId });
    // }

    queryBuilder.orderBy('agent.created_at', 'DESC');
    queryBuilder.take(limit);

    return queryBuilder.getMany();
  }

  /**
   * 获取趋势上升Agent
   */
  private async getTrendingAgents(categoryId: string | null, limit: number): Promise<Agent[]> {
    // TODO: 实现基于时间窗口的趋势计算
    // 暂时用value_score代替
    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.status = :status', { status: AgentStatus.ACTIVE });

    // if (categoryId) {
    //   queryBuilder.andWhere('agent.category_id = :categoryId', { categoryId });
    // }

    queryBuilder.orderBy('agent.value_score', 'DESC');
    queryBuilder.take(limit);

    return queryBuilder.getMany();
  }

  /**
   * 获取个性化推荐Agent
   */
  private async getPersonalizedAgents(
    userId: string, 
    dto: PersonalizedRecommendDto
  ): Promise<Agent[]> {
    const { limit = 20, exclude_ids = [] } = dto;

    // 获取用户的收藏
    const favorites = await this.favoriteRepository.find({
      where: { user_id: userId },
      relations: ['agent'],
      take: 50
    });

    // 获取用户的执行历史
    const executions = await this.executionRepository.find({
      where: { account_id: userId },
      relations: ['agent'],
      take: 50
    });

    // 收集用户偏好的标签
    const tagCounts = new Map<string, number>();
    
    for (const fav of favorites) {
      if (fav.agent?.tags) {
        for (const tag of fav.agent.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 2);
        }
      }
    }

    for (const exec of executions) {
      if (exec.agent?.tags) {
        for (const tag of exec.agent.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    // 获取最常见的标签
    const topTags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // 排除已有的Agent
    const excludeAgentIds = [
      ...exclude_ids,
      ...favorites.map(f => f.agent_id),
      ...executions.map(e => e.agent_id)
    ];

    // 基于标签推荐
    const queryBuilder = this.agentRepository.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .where('agent.status = :status', { status: AgentStatus.ACTIVE });

    if (excludeAgentIds.length > 0) {
      queryBuilder.andWhere('agent.id NOT IN (:...excludeIds)', { 
        excludeIds: excludeAgentIds 
      });
    }

    if (topTags.length > 0) {
      queryBuilder.andWhere('agent.tags && :tags', { tags: topTags });
    }

    queryBuilder.orderBy('agent.value_score', 'DESC');
    queryBuilder.take(limit);

    return queryBuilder.getMany();
  }

  private toRecommendItem(agent: Agent, type: RecommendType): RecommendItemDto {
    const reasons: Record<RecommendType, string> = {
      [RecommendType.HOT]: '热门推荐',
      [RecommendType.NEW]: '新品上架',
      [RecommendType.TRENDING]: '趋势上升',
      [RecommendType.PERSONALIZED]: '猜你喜欢',
      [RecommendType.SIMILAR]: '相似推荐',
      [RecommendType.BOUGHT_ALSO]: '购买此商品的人还买了',
      [RecommendType.VIEWED_ALSO]: '看过此商品的人还看了'
    };

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
      recommend_reason: reasons[type],
      recommend_score: Number(agent.value_score)
    };
  }
}
