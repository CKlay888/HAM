import { IsString, IsUUID } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  @IsUUID()
  agentId: string;
}
