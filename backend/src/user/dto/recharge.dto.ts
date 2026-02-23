import { IsNumber, Min, Max } from 'class-validator';

export class RechargeDto {
  @IsNumber()
  @Min(1)
  @Max(10000)
  amount: number;
}
