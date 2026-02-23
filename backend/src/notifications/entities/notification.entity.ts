export enum NotificationType {
  PURCHASE = 'purchase',
  REVIEW = 'review',
  SYSTEM = 'system',
  PROMOTION = 'promotion',
}

export class Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  types: {
    purchase: boolean;
    review: boolean;
    system: boolean;
    promotion: boolean;
  };
}
