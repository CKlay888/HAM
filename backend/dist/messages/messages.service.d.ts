import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private messages;
    getInbox(userId: string): Promise<Message[]>;
    getSent(userId: string): Promise<Message[]>;
    findOne(id: string, userId: string): Promise<Message>;
    create(dto: CreateMessageDto, senderId: string): Promise<Message>;
    markAsRead(id: string, userId: string): Promise<Message>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
}
