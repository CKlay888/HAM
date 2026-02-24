import { 
  IsString, IsOptional, IsUUID, IsInt, Min, Max, IsArray, IsEnum 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum RecommendType {
  HOT = 'hot',                   // 热门推荐
  NEW = 'new',                   // 新品推荐
  TRENDING = 'trending',         // 趋势上升
  PERSONALIZED = 'personalized', // 个性化推荐
  SIMILAR = 'similar',           // 相似推荐
  BOUGHT_ALSO = 'bought_also',   // 购买此商品的人还买了
  VIEWED_ALSO = 'viewed_also'    // 看过此商品的人还看了
}

export class GetRecommendDto {
  @ApiPropertyOptional({ description: '推荐类型', enum: RecommendType })
  @IsOptional()
  @IsEnum(RecommendType)
  type?: RecommendType;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({ description: '数量', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;
}

export class GetSimilarAgentsDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  agent_id: string;

  @ApiPropertyOptional({ description: '数量', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;
}

export class RecommendItemDto {
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

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  creator_name: string;

  @ApiPropertyOptional({ description: '推荐原因' })
  recommend_reason?: string;

  @ApiPropertyOptional({ description: '推荐分数' })
  recommend_score?: number;
}

export class RecommendResponseDto {
  @ApiProperty({ type: [RecommendItemDto] })
  data: RecommendItemDto[];

  @ApiProperty()
  type: string;

  @ApiProperty()
  total: number;
}

export class PersonalizedRecommendDto {
  @ApiPropertyOptional({ description: '数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: '排除的Agent ID列表' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  exclude_ids?: string[];
}

export class RecordBehaviorDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  agent_id: string;

  @ApiProperty({ description: '行为类型' })
  @IsString()
  behavior_type: string; // view, click, favorite, purchase, execute

  @ApiPropertyOptional({ description: '停留时间(秒)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ description: '来源' })
  @IsOptional()
  @IsString()
  source?: string; // search, recommend, category, direct
}

export class HomeRecommendResponseDto {
  @ApiProperty({ type: [RecommendItemDto], description: '热门推荐' })
  hot: RecommendItemDto[];

  @ApiProperty({ type: [RecommendItemDto], description: '新品上架' })
  new: RecommendItemDto[];

  @ApiProperty({ type: [RecommendItemDto], description: '趋势上升' })
  trending: RecommendItemDto[];

  @ApiPropertyOptional({ type: [RecommendItemDto], description: '猜你喜欢' })
  personalized?: RecommendItemDto[];
}
