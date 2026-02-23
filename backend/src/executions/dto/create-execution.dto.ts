import { IsString, IsUUID, IsObject, IsOptional } from 'class-validator';

export class CreateExecutionDto {
  @IsString()
  @IsUUID()
  agentId: string;

  @IsObject()
  @IsOptional()
  input?: Record<string, any>;
}
