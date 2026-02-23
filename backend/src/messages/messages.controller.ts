import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('inbox')
  async getInbox(@Request() req) {
    return this.messagesService.getInbox(req.user.id);
  }

  @Get('sent')
  async getSent(@Request() req) {
    return this.messagesService.getSent(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.messagesService.findOne(id, req.user.id);
  }

  @Post()
  async create(@Body() dto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(dto, req.user.id);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.messagesService.delete(id, req.user.id);
  }
}
