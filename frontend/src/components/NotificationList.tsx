'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'promo' | 'review';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'order', title: '新订单通知', content: '您的Agent "CodeMaster Pro" 收到新订单，金额 ¥29', time: '5分钟前', read: false },
  { id: '2', type: 'review', title: '新评价', content: '用户"张三"给您的Agent评价了5星好评', time: '1小时前', read: false },
  { id: '3', type: 'promo', title: '限时优惠', content: '新用户首单立减10元，快去分享给好友吧！', time: '2小时前', read: true },
  { id: '4', type: 'system', title: '系统通知', content: '您的Agent "DataInsight" 已通过审核，现已上架', time: '1天前', read: true },
  { id: '5', type: 'order', title: '订单完成', content: '订单 #ORD12345 已完成，收入 ¥99 已到账', time: '2天前', read: true },
];

interface NotificationListProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export default function NotificationList({ 
  notifications = mockNotifications, 
  onMarkRead,
  onMarkAllRead 
}: NotificationListProps) {
  const [items, setItems] = useState(notifications);
  
  const typeConfig = {
    order: { icon: '📦', color: 'bg-orange-100 text-orange-600' },
    system: { icon: '⚙️', color: 'bg-gray-100 text-gray-600' },
    promo: { icon: '🎁', color: 'bg-red-100 text-red-600' },
    review: { icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
  };

  const unreadCount = items.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setItems(items.map(n => n.id === id ? { ...n, read: true } : n));
    onMarkRead?.(id);
  };

  const handleMarkAllRead = () => {
    setItems(items.map(n => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800">🔔 消息通知</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-orange-500 text-sm hover:underline"
          >
            全部已读
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {items.map((notification) => (
          <div 
            key={notification.id}
            onClick={() => handleMarkRead(notification.id)}
            className={`px-6 py-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-orange-50/50' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeConfig[notification.type].color}`}>
              {typeConfig[notification.type].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <p className="text-gray-500 text-sm truncate">{notification.content}</p>
              <span className="text-gray-400 text-xs">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t bg-gray-50 text-center">
        <button className="text-orange-500 text-sm hover:underline">
          查看全部通知 →
        </button>
      </div>
    </div>
  );
}
