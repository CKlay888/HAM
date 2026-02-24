import { 
  IsString, IsOptional, IsUUID, IsInt, Min, Max, MaxLength, 
  IsArray, IsBoolean, IsEnum 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReviewStatus } from '../../entities/review.entity';

// ===== 评论 =====
export class CreateReviewDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  agent_id: string;

  @ApiPropertyOptional({ description: '订单ID' })
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @ApiProperty({ description: '评分 1-5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '评论内容' })
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ description: '图片URL列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: '是否匿名' })
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ description: '评分 1-5' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: '评论内容' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({ description: '图片URL列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class QueryReviewsDto {
  @ApiPropertyOptional({ description: 'Agent ID' })
  @IsOptional()
  @IsUUID()
  agent_id?: string;

  @ApiPropertyOptional({ description: '用户ID' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ description: '评分筛选' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({ description: '是否只显示有图的' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  with_images?: boolean;

  @ApiPropertyOptional({ description: '排序方式', default: 'newest' })
  @IsOptional()
  @IsString()
  sort_by?: string; // newest, oldest, rating_high, rating_low, helpful

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

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  user_name?: string;

  @ApiPropertyOptional()
  user_avatar?: string;

  @ApiProperty()
  agent_id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  is_anonymous: boolean;

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  reply_count: number;

  @ApiProperty()
  is_liked: boolean;

  @ApiPropertyOptional()
  developer_reply?: string;

  @ApiPropertyOptional()
  developer_reply_at?: Date;

  @ApiProperty()
  created_at: Date;
}

export class ReviewListResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  data: ReviewResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;

  @ApiPropertyOptional()
  stats?: ReviewStatsDto;
}

// ===== 评论回复 =====
export class CreateReplyDto {
  @ApiProperty({ description: '回复内容' })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({ description: '父回复ID' })
  @IsOptional()
  @IsUUID()
  parent_id?: string;
}

export class ReplyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  user_name?: string;

  @ApiPropertyOptional()
  user_avatar?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  is_developer: boolean;

  @ApiProperty()
  is_liked: boolean;

  @ApiPropertyOptional()
  parent_id?: string;

  @ApiProperty()
  created_at: Date;
}

// ===== 开发者回复 =====
export class DeveloperReplyDto {
  @ApiProperty({ description: '回复内容' })
  @IsString()
  @MaxLength(1000)
  content: string;
}

// ===== 举报 =====
export class ReportReviewDto {
  @ApiProperty({ description: '举报原因' })
  @IsString()
  @MaxLength(50)
  reason: string;

  @ApiPropertyOptional({ description: '详细描述' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

// ===== 统计 =====
export class ReviewStatsDto {
  @ApiProperty()
  total_count: number;

  @ApiProperty()
  avg_rating: number;

  @ApiProperty({ description: '各评分数量' })
  rating_distribution: {
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
  };

  @ApiProperty()
  with_images_count: number;

  @ApiProperty()
  replied_count: number;
}

// ===== 管理 =====
export class AdminQueryReviewsDto extends QueryReviewsDto {
  @ApiPropertyOptional({ description: '状态', enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}

export class AdminUpdateReviewDto {
  @ApiPropertyOptional({ description: '状态', enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}
