import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Notification,
  NotificationType,
  NotificationSettings,
} from './entities/notification.entity';
import { NotificationSettingsDto } from './dto/notification-settings.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationsService {
  private notifications: Map<string, Notification> = new Map();
  private settings: Map<string, NotificationSettings> = new Map();

  async findAll(userId: string) {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(id: string, userId: string) {
    const notification = this.notifications.get(id);
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    notification.isRead = true;
    return notification;
  }

  async updateSettings(userId: string, dto: NotificationSettingsDto) {
    const current = this.settings.get(userId) || this.getDefaultSettings(userId);

    const updated: NotificationSettings = {
      ...current,
      emailEnabled: dto.emailEnabled ?? current.emailEnabled,
      pushEnabled: dto.pushEnabled ?? current.pushEnabled,
      types: {
        ...current.types,
        ...dto.types,
      },
    };

    this.settings.set(userId, updated);
    return updated;
  }

  async getSettings(userId: string) {
    return this.settings.get(userId) || this.getDefaultSettings(userId);
  }

  // 创建通知（内部使用）
  async create(
    userId: string,
    type: NotificationType,
    title: string,
    content: string,
    metadata?: Record<string, any>,
  ) {
    const notification: Notification = {
      id: randomUUID(),
      userId,
      type,
      title,
      content,
      isRead: false,
      metadata,
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  private getDefaultSettings(userId: string): NotificationSettings {
    return {
      userId,
      emailEnabled: true,
      pushEnabled: true,
      types: {
        purchase: true,
        review: true,
        system: true,
        promotion: false,
      },
    };
  }
}
