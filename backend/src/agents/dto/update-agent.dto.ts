import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';

export class UpdateAgentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  capabilities?: string[];

  @IsUrl()
  @IsOptional()
  apiEndpoint?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
