import { IsString, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsUUID()
  receiverId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  subject: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
