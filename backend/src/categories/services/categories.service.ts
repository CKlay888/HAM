import { 
  Injectable, NotFoundException, BadRequestException, ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, TreeRepository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { 
  CreateCategoryDto, UpdateCategoryDto, QueryCategoriesDto,
  CategoryResponseDto, CategoryTreeResponseDto, CategoryStatsDto 
} from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建分类
   */
  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // 检查父分类是否存在
    if (dto.parent_id) {
      const parent = await this.categoryRepository.findOne({ 
        where: { id: dto.parent_id } 
      });
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
    }

    // 检查同级是否有重名
    const existing = await this.categoryRepository.findOne({
      where: { 
        name: dto.name, 
        parent_id: dto.parent_id || IsNull() 
      }
    });
    if (existing) {
      throw new ConflictException('同级分类下已存在相同名称');
    }

    const category = this.categoryRepository.create(dto);
    await this.categoryRepository.save(category);

    return this.toResponseDto(category);
  }

  /**
   * 更新分类
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 检查是否将自己设为父级
    if (dto.parent_id === id) {
      throw new BadRequestException('不能将自己设为父分类');
    }

    // 检查父分类
    if (dto.parent_id) {
      const parent = await this.categoryRepository.findOne({ 
        where: { id: dto.parent_id } 
      });
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
    }

    Object.assign(category, dto);
    await this.categoryRepository.save(category);

    return this.toResponseDto(category);
  }

  /**
   * 删除分类
   */
  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['children']
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 检查是否有子分类
    const childCount = await this.categoryRepository.count({ 
      where: { parent_id: id } 
    });
    if (childCount > 0) {
      throw new BadRequestException('该分类下还有子分类，无法删除');
    }

    // 检查是否有关联的Agent
    if (category.agent_count > 0) {
      throw new BadRequestException('该分类下还有Agent，无法删除');
    }

    await this.categoryRepository.remove(category);
  }

  /**
   * 获取分类详情
   */
  async findById(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['children']
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return this.toResponseDto(category);
  }

  /**
   * 获取分类列表（支持树形结构）
   */
  async findAll(query: QueryCategoriesDto): Promise<CategoryTreeResponseDto> {
    const { parent_id, include_children, active_only } = query;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (parent_id) {
      queryBuilder.andWhere('category.parent_id = :parent_id', { parent_id });
    } else if (parent_id === undefined || parent_id === null) {
      // 默认查询顶级分类
      queryBuilder.andWhere('category.parent_id IS NULL');
    }

    if (active_only) {
      queryBuilder.andWhere('category.is_active = :active', { active: true });
    }

    queryBuilder.orderBy('category.sort_order', 'ASC');
    queryBuilder.addOrderBy('category.created_at', 'ASC');

    const categories = await queryBuilder.getMany();

    // 如果需要包含子分类
    let data = categories.map(c => this.toResponseDto(c));
    if (include_children) {
      data = await this.buildTree(data, active_only);
    }

    return {
      data,
      total: data.length
    };
  }

  /**
   * 获取完整分类树
   */
  async getTree(activeOnly: boolean = true): Promise<CategoryResponseDto[]> {
    const rootCategories = await this.categoryRepository.find({
      where: { 
        parent_id: IsNull(),
        ...(activeOnly && { is_active: true })
      },
      order: { sort_order: 'ASC' }
    });

    return this.buildTree(
      rootCategories.map(c => this.toResponseDto(c)),
      activeOnly
    );
  }

  /**
   * 构建分类树
   */
  private async buildTree(
    categories: CategoryResponseDto[], 
    activeOnly: boolean = false
  ): Promise<CategoryResponseDto[]> {
    for (const category of categories) {
      const children = await this.categoryRepository.find({
        where: { 
          parent_id: category.id,
          ...(activeOnly && { is_active: true })
        },
        order: { sort_order: 'ASC' }
      });

      if (children.length > 0) {
        category.children = await this.buildTree(
          children.map(c => this.toResponseDto(c)),
          activeOnly
        );
      }
    }
    return categories;
  }

  /**
   * 获取分类统计
   */
  async getStats(categoryId?: string): Promise<CategoryStatsDto[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    
    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    const categories = await queryBuilder.getMany();

    // TODO: 关联Agent表获取统计
    return categories.map(c => ({
      category_id: c.id,
      category_name: c.name,
      agent_count: c.agent_count,
      active_agent_count: 0, // TODO
      total_executions: 0,   // TODO
      total_revenue: 0       // TODO
    }));
  }

  /**
   * 更新分类Agent数量
   */
  async updateAgentCount(categoryId: string, delta: number): Promise<void> {
    await this.categoryRepository.increment(
      { id: categoryId },
      'agent_count',
      delta
    );
  }

  /**
   * 批量更新排序
   */
  async updateSortOrder(items: { id: string; sort_order: number }[]): Promise<void> {
    for (const item of items) {
      await this.categoryRepository.update(item.id, { sort_order: item.sort_order });
    }
  }

  private toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      name_en: category.name_en,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parent_id: category.parent_id,
      sort_order: category.sort_order,
      agent_count: category.agent_count,
      is_active: category.is_active,
      created_at: category.created_at
    };
  }
}
