import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBountyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @IsNumber()
  @Min(1)
  reward: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  deadline: string;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  requirements: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  deliverables: string;
}
