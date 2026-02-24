import { 
  IsString, IsOptional, IsUUID, IsNumber, IsArray, IsInt, 
  Min, Max, MaxLength, IsEnum, IsBoolean 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SortBy {
  RELEVANCE = 'relevance',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RATING = 'rating',
  SALES = 'sales',
  NEWEST = 'newest',
  POPULARITY = 'popularity'
}

export class SearchAgentsDto {
  @ApiProperty({ description: '搜索关键词' })
  @IsString()
  @MaxLength(100)
  keyword: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({ description: '标签筛选' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: '最低价格' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_min?: number;

  @ApiPropertyOptional({ description: '最高价格' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price_max?: number;

  @ApiPropertyOptional({ description: '最低评分' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating_min?: number;

  @ApiPropertyOptional({ description: '定价模式' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pricing_models?: string[];

  @ApiPropertyOptional({ description: '是否只显示免费' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  free_only?: boolean;

  @ApiPropertyOptional({ description: '排序方式', enum: SortBy })
  @IsOptional()
  @IsEnum(SortBy)
  sort_by?: SortBy;

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

export class SearchResultItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  avatar_url?: string;

  @ApiProperty()
  pricing_model: string;

  @ApiProperty()
  cost_per_call: number;

  @ApiProperty()
  value_score: number;

  @ApiProperty()
  total_executions: number;

  @ApiPropertyOptional()
  category_name?: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  creator_name: string;

  @ApiProperty({ description: '搜索相关度分数' })
  relevance_score: number;
}

export class SearchResponseDto {
  @ApiProperty({ type: [SearchResultItemDto] })
  data: SearchResultItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;

  @ApiPropertyOptional({ description: '搜索耗时(ms)' })
  took?: number;

  @ApiPropertyOptional({ description: '相关搜索词' })
  related_keywords?: string[];
}

export class SearchHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  keyword: string;

  @ApiPropertyOptional()
  result_count?: number;

  @ApiProperty()
  created_at: Date;
}

export class HotSearchDto {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  search_count: number;

  @ApiPropertyOptional()
  is_promoted?: boolean;
}

export class SearchSuggestionDto {
  @ApiProperty({ description: '搜索建议词' })
  @IsString()
  @MaxLength(100)
  keyword: string;
}

export class SearchSuggestResponseDto {
  @ApiProperty({ type: [String] })
  suggestions: string[];

  @ApiProperty({ type: [HotSearchDto] })
  hot_searches: HotSearchDto[];
}

export class ClearSearchHistoryDto {
  @ApiPropertyOptional({ description: '要删除的历史ID列表，不传则清空全部' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  ids?: string[];
}
