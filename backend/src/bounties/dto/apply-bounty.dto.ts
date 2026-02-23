import { IsString, IsNumber, MinLength, MaxLength, Min, Max } from 'class-validator';

export class ApplyBountyDto {
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  proposal: string;

  @IsNumber()
  @Min(1)
  @Max(365)
  estimatedDays: number;
}
