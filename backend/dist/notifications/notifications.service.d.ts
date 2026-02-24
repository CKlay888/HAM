import { Notification, NotificationType, NotificationSettings } from './entities/notification.entity';
import { NotificationSettingsDto } from './dto/notification-settings.dto';
export declare class NotificationsService {
    private notifications;
    private settings;
    findAll(userId: string): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    updateSettings(userId: string, dto: NotificationSettingsDto): Promise<NotificationSettings>;
    getSettings(userId: string): Promise<NotificationSettings>;
    create(userId: string, type: NotificationType, title: string, content: string, metadata?: Record<string, any>): Promise<Notification>;
    private getDefaultSettings;
}
