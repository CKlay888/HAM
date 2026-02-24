import { NotificationsService } from './notifications.service';
import { NotificationSettingsDto } from './dto/notification-settings.dto';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<import("./entities/notification.entity").Notification[]>;
    markAsRead(id: string, req: any): Promise<import("./entities/notification.entity").Notification>;
    getSettings(req: any): Promise<import("./entities/notification.entity").NotificationSettings>;
    updateSettings(dto: NotificationSettingsDto, req: any): Promise<import("./entities/notification.entity").NotificationSettings>;
}
