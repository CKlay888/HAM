import { IsString, IsOptional, IsEnum, IsNumberString } from 'class-validator';

export enum SortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  RATING = 'rating',
  SALES = 'sales',
}

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  q?: string; // 关键词

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(SortBy)
  @IsOptional()
  sort?: SortBy;

  @IsNumberString()
  @IsOptional()
  minPrice?: string;

  @IsNumberString()
  @IsOptional()
  maxPrice?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}
