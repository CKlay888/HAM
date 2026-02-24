"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSettings = exports.Notification = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["PURCHASE"] = "purchase";
    NotificationType["REVIEW"] = "review";
    NotificationType["SYSTEM"] = "system";
    NotificationType["PROMOTION"] = "promotion";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class Notification {
    id;
    userId;
    type;
    title;
    content;
    isRead;
    metadata;
    createdAt;
}
exports.Notification = Notification;
class NotificationSettings {
    userId;
    emailEnabled;
    pushEnabled;
    types;
}
exports.NotificationSettings = NotificationSettings;
//# sourceMappingURL=notification.entity.js.map