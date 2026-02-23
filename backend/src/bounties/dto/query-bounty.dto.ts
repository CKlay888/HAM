import { IsString, IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { BountyStatus } from '../entities/bounty.entity';

export enum BountySortBy {
  NEWEST = 'newest',
  REWARD_HIGH = 'reward_high',
  REWARD_LOW = 'reward_low',
  DEADLINE = 'deadline',
}

export class QueryBountyDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(BountyStatus)
  @IsOptional()
  status?: BountyStatus;

  @IsNumberString()
  @IsOptional()
  minReward?: string;

  @IsNumberString()
  @IsOptional()
  maxReward?: string;

  @IsEnum(BountySortBy)
  @IsOptional()
  sort?: BountySortBy;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
