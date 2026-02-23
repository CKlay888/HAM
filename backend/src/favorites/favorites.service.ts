import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AgentsService } from '../agents/agents.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FavoritesService {
  private favorites: Map<string, Favorite> = new Map();

  constructor(private agentsService: AgentsService) {}

  async findAll(userId: string) {
    const userFavorites = Array.from(this.favorites.values()).filter(
      (f) => f.userId === userId,
    );

    // 获取 Agent 详情
    const favoritesWithAgent = await Promise.all(
      userFavorites.map(async (f) => {
        try {
          const agent = await this.agentsService.findOne(f.agentId);
          return { ...f, agent };
        } catch {
          return { ...f, agent: null };
        }
      }),
    );

    return favoritesWithAgent.filter((f) => f.agent !== null);
  }

  async create(dto: CreateFavoriteDto, userId: string): Promise<Favorite> {
    // 验证 Agent 存在
    await this.agentsService.findOne(dto.agentId);

    // 检查是否已收藏
    const existing = Array.from(this.favorites.values()).find(
      (f) => f.userId === userId && f.agentId === dto.agentId,
    );
    if (existing) {
      throw new BadRequestException('Agent already in favorites');
    }

    const favorite: Favorite = {
      id: randomUUID(),
      userId,
      agentId: dto.agentId,
      createdAt: new Date(),
    };

    this.favorites.set(favorite.id, favorite);
    return favorite;
  }

  async remove(id: string, userId: string): Promise<void> {
    const favorite = this.favorites.get(id);
    if (!favorite) {
      throw new NotFoundException(`Favorite ${id} not found`);
    }
    if (favorite.userId !== userId) {
      throw new NotFoundException(`Favorite ${id} not found`);
    }
    this.favorites.delete(id);
  }
}
