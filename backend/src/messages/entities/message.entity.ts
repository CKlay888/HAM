export class Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  parentId?: string; // 回复的消息ID
  createdAt: Date;
}
