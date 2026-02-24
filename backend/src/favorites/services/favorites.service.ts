import { 
  Injectable, NotFoundException, BadRequestException, ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Favorite, FavoriteGroup } from '../../entities/favorite.entity';
import { Agent } from '../../entities/agent.entity';
import {
  CreateFavoriteGroupDto, UpdateFavoriteGroupDto, FavoriteGroupResponseDto,
  AddFavoriteDto, UpdateFavoriteDto, QueryFavoritesDto,
  FavoriteItemDto, FavoriteListResponseDto, BatchFavoriteDto,
  MoveFavoritesDto, FavoriteStatsDto, CheckFavoriteDto, CheckFavoriteResponseDto
} from '../dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(FavoriteGroup)
    private readonly groupRepository: Repository<FavoriteGroup>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  // ===== 收藏夹分组 =====

  /**
   * 创建收藏夹分组
   */
  async createGroup(userId: string, dto: CreateFavoriteGroupDto): Promise<FavoriteGroupResponseDto> {
    // 检查名称是否重复
    const existing = await this.groupRepository.findOne({
      where: { user_id: userId, name: dto.name }
    });
    if (existing) {
      throw new ConflictException('收藏夹名称已存在');
    }

    // 获取最大排序
    const maxSort = await this.groupRepository
      .createQueryBuilder('group')
      .select('MAX(group.sort_order)', 'max')
      .where('group.user_id = :userId', { userId })
      .getRawOne();

    const group = this.groupRepository.create({
      ...dto,
      user_id: userId,
      sort_order: (maxSort?.max || 0) + 1
    });

    await this.groupRepository.save(group);
    return this.toGroupResponseDto(group);
  }

  /**
   * 更新收藏夹分组
   */
  async updateGroup(
    userId: string, 
    groupId: string, 
    dto: UpdateFavoriteGroupDto
  ): Promise<FavoriteGroupResponseDto> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId, user_id: userId }
    });
    if (!group) {
      throw new NotFoundException('收藏夹不存在');
    }

    if (group.is_default && dto.name) {
      throw new BadRequestException('默认收藏夹不能修改名称');
    }

    Object.assign(group, dto);
    await this.groupRepository.save(group);
    return this.toGroupResponseDto(group);
  }

  /**
   * 删除收藏夹分组
   */
  async deleteGroup(userId: string, groupId: string): Promise<void> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId, user_id: userId }
    });
    if (!group) {
      throw new NotFoundException('收藏夹不存在');
    }

    if (group.is_default) {
      throw new BadRequestException('默认收藏夹不能删除');
    }

    // 将该分组下的收藏移到默认分组
    const defaultGroup = await this.getOrCreateDefaultGroup(userId);
    await this.favoriteRepository.update(
      { group_id: groupId },
      { group_id: defaultGroup.id }
    );

    // 更新默认分组数量
    await this.updateGroupItemCount(defaultGroup.id);

    await this.groupRepository.remove(group);
  }

  /**
   * 获取用户的收藏夹列表
   */
  async getGroups(userId: string): Promise<FavoriteGroupResponseDto[]> {
    const groups = await this.groupRepository.find({
      where: { user_id: userId },
      order: { is_default: 'DESC', sort_order: 'ASC' }
    });

    // 确保有默认分组
    if (groups.length === 0 || !groups.some(g => g.is_default)) {
      const defaultGroup = await this.getOrCreateDefaultGroup(userId);
      groups.unshift(defaultGroup);
    }

    return groups.map(g => this.toGroupResponseDto(g));
  }

  // ===== 收藏操作 =====

  /**
   * 添加收藏
   */
  async addFavorite(userId: string, dto: AddFavoriteDto): Promise<FavoriteItemDto> {
    // 检查Agent是否存在
    const agent = await this.agentRepository.findOne({
      where: { id: dto.agent_id },
      relations: ['creator']
    });
    if (!agent) {
      throw new NotFoundException('Agent不存在');
    }

    // 检查是否已收藏
    const existing = await this.favoriteRepository.findOne({
      where: { user_id: userId, agent_id: dto.agent_id }
    });
    if (existing) {
      throw new ConflictException('已经收藏过了');
    }

    // 确定分组
    let groupId = dto.group_id;
    if (!groupId) {
      const defaultGroup = await this.getOrCreateDefaultGroup(userId);
      groupId = defaultGroup.id;
    } else {
      const group = await this.groupRepository.findOne({
        where: { id: groupId, user_id: userId }
      });
      if (!group) {
        throw new NotFoundException('收藏夹不存在');
      }
    }

    const favorite = this.favoriteRepository.create({
      user_id: userId,
      agent_id: dto.agent_id,
      group_id: groupId,
      note: dto.note,
      tags: dto.tags
    });

    await this.favoriteRepository.save(favorite);
    await this.updateGroupItemCount(groupId);

    return this.toFavoriteItemDto(favorite, agent);
  }

  /**
   * 更新收藏
   */
  async updateFavorite(
    userId: string, 
    favoriteId: string, 
    dto: UpdateFavoriteDto
  ): Promise<FavoriteItemDto> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id: favoriteId, user_id: userId },
      relations: ['agent', 'agent.creator', 'group']
    });
    if (!favorite) {
      throw new NotFoundException('收藏不存在');
    }

    const oldGroupId = favorite.group_id;

    // 如果更换分组
    if (dto.group_id && dto.group_id !== oldGroupId) {
      const newGroup = await this.groupRepository.findOne({
        where: { id: dto.group_id, user_id: userId }
      });
      if (!newGroup) {
        throw new NotFoundException('目标收藏夹不存在');
      }
    }

    Object.assign(favorite, dto);
    await this.favoriteRepository.save(favorite);

    // 更新分组计数
    if (oldGroupId && dto.group_id && oldGroupId !== dto.group_id) {
      await this.updateGroupItemCount(oldGroupId);
      await this.updateGroupItemCount(dto.group_id);
    }

    return this.toFavoriteItemDto(favorite, favorite.agent);
  }

  /**
   * 取消收藏
   */
  async removeFavorite(userId: string, agentId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user_id: userId, agent_id: agentId }
    });
    if (!favorite) {
      throw new NotFoundException('未收藏此Agent');
    }

    const groupId = favorite.group_id;
    await this.favoriteRepository.remove(favorite);

    if (groupId) {
      await this.updateGroupItemCount(groupId);
    }
  }

  /**
   * 获取收藏列表
   */
  async getFavorites(userId: string, dto: QueryFavoritesDto): Promise<FavoriteListResponseDto> {
    const { group_id, tag, page = 1, limit = 20 } = dto;

    const queryBuilder = this.favoriteRepository.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.agent', 'agent')
      .leftJoinAndSelect('agent.creator', 'creator')
      .leftJoinAndSelect('favorite.group', 'group')
      .where('favorite.user_id = :userId', { userId });

    if (group_id) {
      queryBuilder.andWhere('favorite.group_id = :groupId', { groupId: group_id });
    }

    if (tag) {
      queryBuilder.andWhere(':tag = ANY(favorite.tags)', { tag });
    }

    queryBuilder.orderBy('favorite.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [favorites, total] = await queryBuilder.getManyAndCount();

    return {
      data: favorites.map(f => this.toFavoriteItemDto(f, f.agent)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 批量添加收藏
   */
  async batchAdd(userId: string, dto: BatchFavoriteDto): Promise<void> {
    const groupId = dto.group_id || (await this.getOrCreateDefaultGroup(userId)).id;

    // 获取已收藏的
    const existing = await this.favoriteRepository.find({
      where: { user_id: userId, agent_id: In(dto.agent_ids) }
    });
    const existingIds = new Set(existing.map(e => e.agent_id));

    // 过滤未收藏的
    const newIds = dto.agent_ids.filter(id => !existingIds.has(id));

    if (newIds.length > 0) {
      const favorites = newIds.map(agent_id => 
        this.favoriteRepository.create({
          user_id: userId,
          agent_id,
          group_id: groupId
        })
      );
      await this.favoriteRepository.save(favorites);
      await this.updateGroupItemCount(groupId);
    }
  }

  /**
   * 批量移动收藏
   */
  async batchMove(userId: string, dto: MoveFavoritesDto): Promise<void> {
    // 验证目标分组
    const targetGroup = await this.groupRepository.findOne({
      where: { id: dto.target_group_id, user_id: userId }
    });
    if (!targetGroup) {
      throw new NotFoundException('目标收藏夹不存在');
    }

    // 获取原分组ID
    const favorites = await this.favoriteRepository.find({
      where: { id: In(dto.favorite_ids), user_id: userId }
    });
    const oldGroupIds = [...new Set(favorites.map(f => f.group_id).filter(Boolean))];

    // 移动
    await this.favoriteRepository.update(
      { id: In(dto.favorite_ids), user_id: userId },
      { group_id: dto.target_group_id }
    );

    // 更新计数
    for (const groupId of oldGroupIds) {
      await this.updateGroupItemCount(groupId!);
    }
    await this.updateGroupItemCount(dto.target_group_id);
  }

  /**
   * 批量删除收藏
   */
  async batchRemove(userId: string, agentIds: string[]): Promise<void> {
    const favorites = await this.favoriteRepository.find({
      where: { user_id: userId, agent_id: In(agentIds) }
    });

    const groupIds = [...new Set(favorites.map(f => f.group_id).filter(Boolean))];

    await this.favoriteRepository.delete({
      user_id: userId,
      agent_id: In(agentIds)
    });

    for (const groupId of groupIds) {
      await this.updateGroupItemCount(groupId!);
    }
  }

  /**
   * 检查是否已收藏
   */
  async checkFavorite(userId: string, dto: CheckFavoriteDto): Promise<CheckFavoriteResponseDto> {
    const favorites = await this.favoriteRepository.find({
      where: { user_id: userId, agent_id: In(dto.agent_ids) }
    });

    return {
      favorited_ids: favorites.map(f => f.agent_id)
    };
  }

  /**
   * 获取收藏统计
   */
  async getStats(userId: string): Promise<FavoriteStatsDto> {
    const groups = await this.groupRepository.find({
      where: { user_id: userId }
    });

    const totalCount = groups.reduce((sum, g) => sum + g.item_count, 0);

    // 获取标签统计
    const tagStats = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .select('UNNEST(favorite.tags)', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('favorite.user_id = :userId', { userId })
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total_count: totalCount,
      group_count: groups.length,
      by_group: groups.map(g => ({
        group_id: g.id,
        group_name: g.name,
        count: g.item_count
      })),
      by_tag: tagStats.map(t => ({
        tag: t.tag,
        count: Number(t.count)
      }))
    };
  }

  // ===== 私有方法 =====

  private async getOrCreateDefaultGroup(userId: string): Promise<FavoriteGroup> {
    let defaultGroup = await this.groupRepository.findOne({
      where: { user_id: userId, is_default: true }
    });

    if (!defaultGroup) {
      defaultGroup = this.groupRepository.create({
        user_id: userId,
        name: '默认收藏夹',
        is_default: true,
        sort_order: 0
      });
      await this.groupRepository.save(defaultGroup);
    }

    return defaultGroup;
  }

  private async updateGroupItemCount(groupId: string): Promise<void> {
    const count = await this.favoriteRepository.count({
      where: { group_id: groupId }
    });
    await this.groupRepository.update(groupId, { item_count: count });
  }

  private toGroupResponseDto(group: FavoriteGroup): FavoriteGroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      is_default: group.is_default,
      is_public: group.is_public,
      sort_order: group.sort_order,
      item_count: group.item_count,
      created_at: group.created_at
    };
  }

  private toFavoriteItemDto(favorite: Favorite, agent: Agent): FavoriteItemDto {
    return {
      id: favorite.id,
      agent_id: agent.id,
      agent_name: agent.name,
      agent_description: agent.description,
      agent_avatar: agent.avatar_url,
      agent_pricing_model: agent.pricing_model,
      agent_cost: Number(agent.cost_per_call),
      agent_value_score: Number(agent.value_score),
      group_id: favorite.group_id,
      group_name: favorite.group?.name,
      note: favorite.note,
      tags: favorite.tags || [],
      created_at: favorite.created_at
    };
  }
}
