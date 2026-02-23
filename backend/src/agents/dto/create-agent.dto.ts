import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  currency?: string; // 默认 USD

  @IsArray()
  @IsString({ each: true })
  capabilities: string[];

  @IsUrl()
  @IsOptional()
  apiEndpoint?: string;
}
