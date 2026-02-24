import { 
  IsString, IsOptional, IsUUID, IsBoolean, IsInt, Min, Max, 
  MaxLength, IsArray 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ===== 收藏夹分组 =====
export class CreateFavoriteGroupDto {
  @ApiProperty({ description: '分组名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '是否公开' })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}

export class UpdateFavoriteGroupDto extends PartialType(CreateFavoriteGroupDto) {
  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}

export class FavoriteGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  is_default: boolean;

  @ApiProperty()
  is_public: boolean;

  @ApiProperty()
  sort_order: number;

  @ApiProperty()
  item_count: number;

  @ApiProperty()
  created_at: Date;
}

// ===== 收藏 =====
export class AddFavoriteDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  agent_id: string;

  @ApiPropertyOptional({ description: '收藏夹分组ID' })
  @IsOptional()
  @IsUUID()
  group_id?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;

  @ApiPropertyOptional({ description: '标签' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateFavoriteDto {
  @ApiPropertyOptional({ description: '收藏夹分组ID' })
  @IsOptional()
  @IsUUID()
  group_id?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;

  @ApiPropertyOptional({ description: '标签' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class QueryFavoritesDto {
  @ApiPropertyOptional({ description: '分组ID' })
  @IsOptional()
  @IsUUID()
  group_id?: string;

  @ApiPropertyOptional({ description: '标签筛选' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

export class FavoriteItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  agent_id: string;

  @ApiProperty()
  agent_name: string;

  @ApiProperty()
  agent_description: string;

  @ApiPropertyOptional()
  agent_avatar?: string;

  @ApiProperty()
  agent_pricing_model: string;

  @ApiProperty()
  agent_cost: number;

  @ApiProperty()
  agent_value_score: number;

  @ApiPropertyOptional()
  group_id?: string;

  @ApiPropertyOptional()
  group_name?: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  created_at: Date;
}

export class FavoriteListResponseDto {
  @ApiProperty({ type: [FavoriteItemDto] })
  data: FavoriteItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

// ===== 批量操作 =====
export class BatchFavoriteDto {
  @ApiProperty({ description: 'Agent ID列表' })
  @IsArray()
  @IsUUID('4', { each: true })
  agent_ids: string[];

  @ApiPropertyOptional({ description: '目标分组ID' })
  @IsOptional()
  @IsUUID()
  group_id?: string;
}

export class MoveFavoritesDto {
  @ApiProperty({ description: '收藏ID列表' })
  @IsArray()
  @IsUUID('4', { each: true })
  favorite_ids: string[];

  @ApiProperty({ description: '目标分组ID' })
  @IsUUID()
  target_group_id: string;
}

export class FavoriteStatsDto {
  @ApiProperty()
  total_count: number;

  @ApiProperty()
  group_count: number;

  @ApiProperty({ type: [Object] })
  by_group: {
    group_id: string;
    group_name: string;
    count: number;
  }[];

  @ApiProperty({ type: [Object] })
  by_tag: {
    tag: string;
    count: number;
  }[];
}

export class CheckFavoriteDto {
  @ApiProperty({ description: 'Agent ID列表' })
  @IsArray()
  @IsUUID('4', { each: true })
  agent_ids: string[];
}

export class CheckFavoriteResponseDto {
  @ApiProperty({ description: '已收藏的Agent ID列表' })
  favorited_ids: string[];
}
