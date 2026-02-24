import { 
  IsString, IsOptional, IsUUID, IsBoolean, IsInt, Min, 
  IsArray, MaxLength, IsHexColor 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ description: '英文名称' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name_en?: string;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '颜色' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({ description: '父分类ID' })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ description: '关键词' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ description: '是否激活' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class QueryCategoriesDto {
  @ApiPropertyOptional({ description: '父分类ID，不传则查询顶级分类' })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiPropertyOptional({ description: '是否包含子分类' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  include_children?: boolean;

  @ApiPropertyOptional({ description: '是否只显示激活的' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active_only?: boolean;
}

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  name_en?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  parent_id?: string;

  @ApiProperty()
  sort_order: number;

  @ApiProperty()
  agent_count: number;

  @ApiProperty()
  is_active: boolean;

  @ApiPropertyOptional({ type: [CategoryResponseDto] })
  children?: CategoryResponseDto[];

  @ApiProperty()
  created_at: Date;
}

export class CategoryTreeResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty()
  total: number;
}

export class CategoryStatsDto {
  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  agent_count: number;

  @ApiProperty()
  active_agent_count: number;

  @ApiProperty()
  total_executions: number;

  @ApiProperty()
  total_revenue: number;
}
