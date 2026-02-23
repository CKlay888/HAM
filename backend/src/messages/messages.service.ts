import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MessagesService {
  private messages: Map<string, Message> = new Map();

  async getInbox(userId: string) {
    return Array.from(this.messages.values())
      .filter((m) => m.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSent(userId: string) {
    return Array.from(this.messages.values())
      .filter((m) => m.senderId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: string, userId: string) {
    const message = this.messages.get(id);
    if (!message) {
      throw new NotFoundException(`Message ${id} not found`);
    }
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return message;
  }

  async create(dto: CreateMessageDto, senderId: string): Promise<Message> {
    const message: Message = {
      id: randomUUID(),
      senderId,
      receiverId: dto.receiverId,
      subject: dto.subject,
      content: dto.content,
      isRead: false,
      parentId: dto.parentId,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async markAsRead(id: string, userId: string) {
    const message = await this.findOne(id, userId);
    if (message.receiverId !== userId) {
      throw new ForbiddenException('Only receiver can mark as read');
    }
    message.isRead = true;
    return message;
  }

  async delete(id: string, userId: string) {
    const message = await this.findOne(id, userId);
    this.messages.delete(id);
    return { message: 'Message deleted' };
  }

  async getUnreadCount(userId: string) {
    const count = Array.from(this.messages.values()).filter(
      (m) => m.receiverId === userId && !m.isRead,
    ).length;
    return { unreadCount: count };
  }
}
