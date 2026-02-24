import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    getInbox(req: any): Promise<import("./entities/message.entity").Message[]>;
    getSent(req: any): Promise<import("./entities/message.entity").Message[]>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    findOne(id: string, req: any): Promise<import("./entities/message.entity").Message>;
    create(dto: CreateMessageDto, req: any): Promise<import("./entities/message.entity").Message>;
    markAsRead(id: string, req: any): Promise<import("./entities/message.entity").Message>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
