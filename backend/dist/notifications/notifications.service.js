"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let NotificationsService = class NotificationsService {
    notifications = new Map();
    settings = new Map();
    async findAll(userId) {
        return Array.from(this.notifications.values())
            .filter((n) => n.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async markAsRead(id, userId) {
        const notification = this.notifications.get(id);
        if (!notification || notification.userId !== userId) {
            throw new common_1.NotFoundException(`Notification ${id} not found`);
        }
        notification.isRead = true;
        return notification;
    }
    async updateSettings(userId, dto) {
        const current = this.settings.get(userId) || this.getDefaultSettings(userId);
        const updated = {
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
    async getSettings(userId) {
        return this.settings.get(userId) || this.getDefaultSettings(userId);
    }
    async create(userId, type, title, content, metadata) {
        const notification = {
            id: (0, crypto_1.randomUUID)(),
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
    getDefaultSettings(userId) {
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map