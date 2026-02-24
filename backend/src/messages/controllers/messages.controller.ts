import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import {
  SendMessageDto, QueryMessagesDto, MessageResponseDto,
  MessageListResponseDto, MarkReadDto, MessageCountDto,
  CreateAnnouncementDto, AnnouncementResponseDto,
  ConversationListResponseDto
} from '../dto/message.dto';
import { MessageType } from '../../entities/message.entity';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('消息')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: '发送私信' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async send(
    @Req() req: any,
    @Body() dto: SendMessageDto
  ): Promise<MessageResponseDto> {
    return this.messagesService.sendPrivate(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取消息列表' })
  @ApiResponse({ status: 200, type: MessageListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getMessages(
    @Req() req: any,
    @Query() dto: QueryMessagesDto
  ): Promise<MessageListResponseDto> {
    return this.messagesService.getMessages(req.user.id, dto);
  }

  @Get('count')
  @ApiOperation({ summary: '获取消息统计' })
  @ApiResponse({ status: 200, type: MessageCountDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getCount(@Req() req: any): Promise<MessageCountDto> {
    return this.messagesService.getCount(req.user.id);
  }

  @Get('conversations')
  @ApiOperation({ summary: '获取会话列表' })
  @ApiResponse({ status: 200, type: ConversationListResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getConversations(@Req() req: any): Promise<ConversationListResponseDto> {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('announcements')
  @ApiOperation({ summary: '获取有效公告' })
  @ApiResponse({ status: 200, type: [AnnouncementResponseDto] })
  async getAnnouncements(): Promise<AnnouncementResponseDto[]> {
    return this.messagesService.getActiveAnnouncements();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取消息详情' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getMessage(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<MessageResponseDto> {
    return this.messagesService.getMessage(req.user.id, id);
  }

  @Put('read')
  @ApiOperation({ summary: '标记已读' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Req() req: any,
    @Body() dto: MarkReadDto
  ): Promise<void> {
    return this.messagesService.markAsRead(req.user.id, dto);
  }

  @Put('read-all')
  @ApiOperation({ summary: '全部标记已读' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async markAllAsRead(
    @Req() req: any,
    @Query('type') type?: MessageType
  ): Promise<void> {
    return this.messagesService.markAllAsRead(req.user.id, type);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除消息' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async delete(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<void> {
    return this.messagesService.deleteMessage(req.user.id, id);
  }

  // ===== 公告管理（管理员） =====

  @Post('announcements')
  @ApiOperation({ summary: '创建公告（管理员）' })
  @ApiResponse({ status: 201, type: AnnouncementResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto
  ): Promise<AnnouncementResponseDto> {
    return this.messagesService.createAnnouncement(dto);
  }

  @Delete('announcements/:id')
  @ApiOperation({ summary: '删除公告（管理员）' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteAnnouncement(@Param('id') id: string): Promise<void> {
    return this.messagesService.deleteAnnouncement(id);
  }
}
