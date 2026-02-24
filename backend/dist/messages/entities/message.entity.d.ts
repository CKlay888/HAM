export declare class Message {
    id: string;
    senderId: string;
    receiverId: string;
    subject: string;
    content: string;
    isRead: boolean;
    parentId?: string;
    createdAt: Date;
}
