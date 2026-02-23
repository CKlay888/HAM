import { Injectable } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SearchQueryDto, SortBy } from './dto/search-query.dto';
import { Agent } from '../agents/entities/agent.entity';

@Injectable()
export class SearchService {
  // 预定义分类
  private categories = [
    { id: 'productivity', name: '效率工具', description: '提升工作效率的 Agent' },
    { id: 'creative', name: '创意设计', description: '设计和创意相关' },
    { id: 'data', name: '数据分析', description: '数据处理和分析' },
    { id: 'communication', name: '沟通协作', description: '沟通和协作工具' },
    { id: 'development', name: '开发工具', description: '编程和开发辅助' },
    { id: 'other', name: '其他', description: '其他类型' },
  ];

  constructor(
    private agentsService: AgentsService,
    private purchasesService: PurchasesService,
    private reviewsService: ReviewsService,
  ) {}

  async search(query: SearchQueryDto) {
    let agents = await this.agentsService.findAll({ isActive: true });

    // 关键词搜索
    if (query.q) {
      const keyword = query.q.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(keyword) ||
          a.description.toLowerCase().includes(keyword) ||
          a.capabilities.some((c) => c.toLowerCase().includes(keyword)),
      );
    }

    // 分类过滤
    if (query.category) {
      agents = agents.filter((a) => a.category === query.category);
    }

    // 价格过滤
    if (query.minPrice) {
      const minPrice = parseFloat(query.minPrice);
      agents = agents.filter((a) => a.price >= minPrice);
    }
    if (query.maxPrice) {
      const maxPrice = parseFloat(query.maxPrice);
      agents = agents.filter((a) => a.price <= maxPrice);
    }

    // 排序
    agents = this.sortAgents(agents, query.sort);

    // 分页
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const total = agents.length;
    const results = agents.slice((page - 1) * limit, page * limit);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategories() {
    return this.categories;
  }

  async getHotAgents(limit = 10) {
    // 按销量排序（模拟：随机排序，实际应统计购买数）
    const agents = await this.agentsService.findAll({ isActive: true });
    return agents
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map((a) => ({ ...a, salesCount: Math.floor(Math.random() * 100) }));
  }

  async getRecommendedAgents(limit = 10) {
    // 推荐算法（模拟：返回评分最高的，实际应基于用户行为）
    const agents = await this.agentsService.findAll({ isActive: true });
    return agents
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map((a) => ({ ...a, recommendScore: Math.random().toFixed(2) }));
  }

  private sortAgents(agents: Agent[], sort?: SortBy): Agent[] {
    switch (sort) {
      case SortBy.PRICE_ASC:
        return agents.sort((a, b) => a.price - b.price);
      case SortBy.PRICE_DESC:
        return agents.sort((a, b) => b.price - a.price);
      case SortBy.NEWEST:
        return agents.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
      case SortBy.RATING:
      case SortBy.SALES:
      default:
        return agents.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }
  }
}
