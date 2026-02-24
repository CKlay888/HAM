import { 
  Injectable, NotFoundException, ForbiddenException, BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Message, MessageType, MessageStatus, Announcement } from '../../entities/message.entity';
import { User } from '../../entities/user.entity';
import {
  SendMessageDto, SendSystemMessageDto, QueryMessagesDto,
  MessageResponseDto, MessageListResponseDto, MarkReadDto,
  MessageCountDto, CreateAnnouncementDto, AnnouncementResponseDto,
  ConversationDto, ConversationListResponseDto
} from '../dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 发送私信
   */
  async sendPrivate(senderId: string, dto: SendMessageDto): Promise<MessageResponseDto> {
    // 检查接收者
    const receiver = await this.userRepository.findOne({ 
      where: { id: dto.receiver_id } 
    });
    if (!receiver) {
      throw new NotFoundException('接收者不存在');
    }

    // 不能给自己发私信
    if (senderId === dto.receiver_id) {
      throw new BadRequestException('不能给自己发送私信');
    }

    const message = this.messageRepository.create({
      sender_id: senderId,
      receiver_id: dto.receiver_id,
      type: MessageType.PRIVATE,
      title: dto.title,
      content: dto.content
    });

    await this.messageRepository.save(message);
    return this.toResponseDto(message);
  }

  /**
   * 发送系统消息（内部使用）
   */
  async sendSystem(dto: SendSystemMessageDto): Promise<MessageResponseDto> {
    const message = this.messageRepository.create({
      receiver_id: dto.receiver_id,
      type: dto.type,
      title: dto.title,
      content: dto.content,
      metadata: dto.metadata
    });

    await this.messageRepository.save(message);
    return this.toResponseDto(message);
  }

  /**
   * 批量发送系统消息
   */
  async sendBulkSystem(
    receiverIds: string[], 
    dto: Omit<SendSystemMessageDto, 'receiver_id'>
  ): Promise<void> {
    const messages = receiverIds.map(receiverId => 
      this.messageRepository.create({
        receiver_id: receiverId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        metadata: dto.metadata
      })
    );

    await this.messageRepository.save(messages);
  }

  /**
   * 获取消息列表
   */
  async getMessages(userId: string, dto: QueryMessagesDto): Promise<MessageListResponseDto> {
    const { type, status, unread_only, page = 1, limit = 20 } = dto;

    const queryBuilder = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.receiver_id = :userId', { userId })
      .andWhere('message.status != :deleted', { deleted: MessageStatus.DELETED });

    if (type) {
      queryBuilder.andWhere('message.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('message.status = :status', { status });
    }

    if (unread_only) {
      queryBuilder.andWhere('message.status = :unread', { unread: MessageStatus.UNREAD });
    }

    queryBuilder.orderBy('message.created_at', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [messages, total] = await queryBuilder.getManyAndCount();

    // 获取未读数
    const unreadCount = await this.messageRepository.count({
      where: {
        receiver_id: userId,
        status: MessageStatus.UNREAD
      }
    });

    return {
      data: messages.map(m => this.toResponseDto(m)),
      total,
      unread_count: unreadCount,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * 获取消息详情
   */
  async getMessage(userId: string, messageId: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender']
    });

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    if (message.receiver_id !== userId && message.sender_id !== userId) {
      throw new ForbiddenException('无权查看此消息');
    }

    // 标记为已读
    if (message.receiver_id === userId && message.status === MessageStatus.UNREAD) {
      message.status = MessageStatus.READ;
      message.read_at = new Date();
      await this.messageRepository.save(message);
    }

    return this.toResponseDto(message);
  }

  /**
   * 标记已读
   */
  async markAsRead(userId: string, dto: MarkReadDto): Promise<void> {
    await this.messageRepository.update(
      {
        id: In(dto.message_ids),
        receiver_id: userId,
        status: MessageStatus.UNREAD
      },
      {
        status: MessageStatus.READ,
        read_at: new Date()
      }
    );
  }

  /**
   * 全部标记已读
   */
  async markAllAsRead(userId: string, type?: MessageType): Promise<void> {
    const updateCriteria: any = {
      receiver_id: userId,
      status: MessageStatus.UNREAD
    };

    if (type) {
      updateCriteria.type = type;
    }

    await this.messageRepository.update(
      updateCriteria,
      {
        status: MessageStatus.READ,
        read_at: new Date()
      }
    );
  }

  /**
   * 删除消息
   */
  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('消息不存在');
    }

    if (message.receiver_id !== userId) {
      throw new ForbiddenException('无权删除此消息');
    }

    message.status = MessageStatus.DELETED;
    await this.messageRepository.save(message);
  }

  /**
   * 获取消息统计
   */
  async getCount(userId: string): Promise<MessageCountDto> {
    const [total, unread, privateUnread, systemUnread] = await Promise.all([
      this.messageRepository.count({
        where: { receiver_id: userId, status: Not(MessageStatus.DELETED) }
      }),
      this.messageRepository.count({
        where: { receiver_id: userId, status: MessageStatus.UNREAD }
      }),
      this.messageRepository.count({
        where: { 
          receiver_id: userId, 
          status: MessageStatus.UNREAD,
          type: MessageType.PRIVATE
        }
      }),
      this.messageRepository.count({
        where: { 
          receiver_id: userId, 
          status: MessageStatus.UNREAD,
          type: MessageType.SYSTEM
        }
      })
    ]);

    return {
      total,
      unread,
      private_unread: privateUnread,
      system_unread: systemUnread
    };
  }

  /**
   * 获取会话列表
   */
  async getConversations(userId: string): Promise<ConversationListResponseDto> {
    // 获取用户的私信会话
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.receiver_id = :userId', { userId })
      .andWhere('message.type = :type', { type: MessageType.PRIVATE })
      .andWhere('message.status != :deleted', { deleted: MessageStatus.DELETED })
      .orderBy('message.created_at', 'DESC')
      .getMany();

    // 按发送者分组
    const conversationMap = new Map<string, {
      user: User;
      lastMessage: Message;
      unreadCount: number;
    }>();

    for (const message of messages) {
      const otherUserId = message.sender_id;
      if (!otherUserId) continue;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: message.sender,
          lastMessage: message,
          unreadCount: message.status === MessageStatus.UNREAD ? 1 : 0
        });
      } else if (message.status === MessageStatus.UNREAD) {
        conversationMap.get(otherUserId)!.unreadCount++;
      }
    }

    const conversations: ConversationDto[] = Array.from(conversationMap.entries())
      .map(([_, conv]) => ({
        user_id: conv.user.id,
        user_name: conv.user.username,
        user_avatar: conv.user.avatar_url,
        last_message: conv.lastMessage.content.substring(0, 50),
        last_message_at: conv.lastMessage.created_at,
        unread_count: conv.unreadCount
      }));

    return {
      data: conversations,
      total: conversations.length
    };
  }

  // ===== 公告管理 =====

  /**
   * 创建公告
   */
  async createAnnouncement(dto: CreateAnnouncementDto): Promise<AnnouncementResponseDto> {
    const announcement = this.announcementRepository.create(dto);
    await this.announcementRepository.save(announcement);
    return this.toAnnouncementDto(announcement);
  }

  /**
   * 获取有效公告
   */
  async getActiveAnnouncements(): Promise<AnnouncementResponseDto[]> {
    const now = new Date();
    
    const announcements = await this.announcementRepository.find({
      where: {
        is_active: true
      },
      order: { sort_order: 'DESC', created_at: 'DESC' }
    });

    // 过滤时间范围
    const valid = announcements.filter(a => {
      if (a.start_at && a.start_at > now) return false;
      if (a.end_at && a.end_at < now) return false;
      return true;
    });

    return valid.map(a => this.toAnnouncementDto(a));
  }

  /**
   * 删除公告
   */
  async deleteAnnouncement(id: string): Promise<void> {
    const result = await this.announcementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('公告不存在');
    }
  }

  private toResponseDto(message: Message): MessageResponseDto {
    return {
      id: message.id,
      sender_id: message.sender_id,
      sender_name: message.sender?.username,
      sender_avatar: message.sender?.avatar_url,
      type: message.type,
      title: message.title,
      content: message.content,
      status: message.status,
      metadata: message.metadata,
      read_at: message.read_at,
      created_at: message.created_at
    };
  }

  private toAnnouncementDto(announcement: Announcement): AnnouncementResponseDto {
    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      level: announcement.level,
      target_url: announcement.target_url,
      created_at: announcement.created_at
    };
  }
}

function Not(status: MessageStatus): any {
  return { $ne: status };
}
