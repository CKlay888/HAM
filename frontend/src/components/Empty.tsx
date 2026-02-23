'use client';

import Link from 'next/link';

type EmptyType = 'default' | 'search' | 'orders' | 'favorites' | 'agents' | 'notifications' | 'error';

interface EmptyProps {
  type?: EmptyType;
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

const presets: Record<EmptyType, { icon: string; title: string; description: string }> = {
  default: {
    icon: '📭',
    title: '暂无数据',
    description: '这里空空如也',
  },
  search: {
    icon: '🔍',
    title: '未找到结果',
    description: '换个关键词试试吧',
  },
  orders: {
    icon: '📦',
    title: '暂无订单',
    description: '快去市场逛逛，发现心仪的Agent吧',
  },
  favorites: {
    icon: '💔',
    title: '收藏夹是空的',
    description: '收藏喜欢的Agent，方便下次快速找到',
  },
  agents: {
    icon: '🤖',
    title: '还没有Agent',
    description: '发布你的第一个Agent，开启赚钱之旅',
  },
  notifications: {
    icon: '🔔',
    title: '没有新通知',
    description: '所有通知都已查看',
  },
  error: {
    icon: '😵',
    title: '出错了',
    description: '页面加载失败，请稍后重试',
  },
};

export default function Empty({
  type = 'default',
  title,
  description,
  icon,
  actionText,
  actionHref,
  onAction,
}: EmptyProps) {
  const preset = presets[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="text-6xl mb-4 animate-bounce">
        {icon || preset.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {title || preset.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-center max-w-sm mb-6">
        {description || preset.description}
      </p>

      {/* Action */}
      {(actionText || type === 'orders' || type === 'favorites' || type === 'agents') && (
        actionHref ? (
          <Link
            href={actionHref}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            {actionText || (type === 'orders' || type === 'favorites' ? '去逛逛' : '立即发布')}
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            {actionText || '重试'}
          </button>
        ) : null
      )}
    </div>
  );
}

// Inline empty state for smaller areas
interface InlineEmptyProps {
  icon?: string;
  text: string;
}

export function InlineEmpty({ icon = '📭', text }: InlineEmptyProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

// Empty state with illustration
interface IllustratedEmptyProps {
  imageSrc?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function IllustratedEmpty({ imageSrc, title, description, action }: IllustratedEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {imageSrc ? (
        <img src={imageSrc} alt="" className="w-48 h-48 object-contain mb-6" />
      ) : (
        <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-6xl">🎨</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
