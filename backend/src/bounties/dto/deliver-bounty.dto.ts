import { IsString, IsArray, IsOptional, MinLength, MaxLength } from 'class-validator';

export class DeliverBountyDto {
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  deliverables: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  notes?: string;
}
