import { 
  IsString, IsOptional, IsUUID, IsEnum, IsInt, Min, Max, 
  MaxLength, IsBoolean, IsArray 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MessageType, MessageStatus } from '../../entities/message.entity';

export class SendMessageDto {
  @ApiProperty({ description: '接收者ID' })
  @IsUUID()
  receiver_id: string;

  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @MaxLength(5000)
  content: string;
}

export class SendSystemMessageDto {
  @ApiProperty({ description: '接收者ID' })
  @IsUUID()
  receiver_id: string;

  @ApiProperty({ description: '消息类型', enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({ description: '元数据' })
  @IsOptional()
  metadata?: {
    related_id?: string;
    related_type?: string;
    action_url?: string;
    image_url?: string;
  };
}

export class QueryMessagesDto {
  @ApiPropertyOptional({ description: '消息类型', enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({ description: '状态', enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({ description: '是否未读' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  unread_only?: boolean;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

export class MessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  sender_id?: string;

  @ApiPropertyOptional()
  sender_name?: string;

  @ApiPropertyOptional()
  sender_avatar?: string;

  @ApiProperty()
  type: MessageType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  status: MessageStatus;

  @ApiPropertyOptional()
  metadata?: {
    related_id?: string;
    related_type?: string;
    action_url?: string;
    image_url?: string;
  };

  @ApiPropertyOptional()
  read_at?: Date;

  @ApiProperty()
  created_at: Date;
}

export class MessageListResponseDto {
  @ApiProperty({ type: [MessageResponseDto] })
  data: MessageResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  unread_count: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class MarkReadDto {
  @ApiProperty({ description: '消息ID列表' })
  @IsArray()
  @IsUUID('4', { each: true })
  message_ids: string[];
}

export class MessageCountDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  unread: number;

  @ApiProperty()
  private_unread: number;

  @ApiProperty()
  system_unread: number;
}

export class CreateAnnouncementDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({ description: '级别', default: 'info' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @Type(() => Date)
  start_at?: Date;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @Type(() => Date)
  end_at?: Date;

  @ApiPropertyOptional({ description: '跳转链接' })
  @IsOptional()
  @IsString()
  target_url?: string;
}

export class AnnouncementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  level: string;

  @ApiPropertyOptional()
  target_url?: string;

  @ApiProperty()
  created_at: Date;
}

export class ConversationDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  user_name: string;

  @ApiPropertyOptional()
  user_avatar?: string;

  @ApiProperty()
  last_message: string;

  @ApiProperty()
  last_message_at: Date;

  @ApiProperty()
  unread_count: number;
}

export class ConversationListResponseDto {
  @ApiProperty({ type: [ConversationDto] })
  data: ConversationDto[];

  @ApiProperty()
  total: number;
}
