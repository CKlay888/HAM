export declare enum NotificationType {
    PURCHASE = "purchase",
    REVIEW = "review",
    SYSTEM = "system",
    PROMOTION = "promotion"
}
export declare class Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    content: string;
    isRead: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class NotificationSettings {
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
