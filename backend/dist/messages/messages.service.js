"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let MessagesService = class MessagesService {
    messages = new Map();
    async getInbox(userId) {
        return Array.from(this.messages.values())
            .filter((m) => m.receiverId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async getSent(userId) {
        return Array.from(this.messages.values())
            .filter((m) => m.senderId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findOne(id, userId) {
        const message = this.messages.get(id);
        if (!message) {
            throw new common_1.NotFoundException(`Message ${id} not found`);
        }
        if (message.senderId !== userId && message.receiverId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return message;
    }
    async create(dto, senderId) {
        const message = {
            id: (0, crypto_1.randomUUID)(),
            senderId,
            receiverId: dto.receiverId,
            subject: dto.subject,
            content: dto.content,
            isRead: false,
            parentId: dto.parentId,
            createdAt: new Date(),
        };
        this.messages.set(message.id, message);
        return message;
    }
    async markAsRead(id, userId) {
        const message = await this.findOne(id, userId);
        if (message.receiverId !== userId) {
            throw new common_1.ForbiddenException('Only receiver can mark as read');
        }
        message.isRead = true;
        return message;
    }
    async delete(id, userId) {
        const message = await this.findOne(id, userId);
        this.messages.delete(id);
        return { message: 'Message deleted' };
    }
    async getUnreadCount(userId) {
        const count = Array.from(this.messages.values()).filter((m) => m.receiverId === userId && !m.isRead).length;
        return { unreadCount: count };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
//# sourceMappingURL=messages.service.js.map