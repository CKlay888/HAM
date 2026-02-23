'use client';

type BadgeType = 'hot' | 'sale' | 'new' | 'limit' | 'recommend';

interface PromoBadgeProps {
  type: BadgeType;
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const badgeConfig: Record<BadgeType, { bg: string; text: string; defaultLabel: string }> = {
  hot: { bg: 'bg-red-500', text: 'text-white', defaultLabel: 'HOT' },
  sale: { bg: 'bg-orange-500', text: 'text-white', defaultLabel: '特惠' },
  new: { bg: 'bg-green-500', text: 'text-white', defaultLabel: '新品' },
  limit: { bg: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'text-white', defaultLabel: '限时' },
  recommend: { bg: 'bg-blue-500', text: 'text-white', defaultLabel: '推荐' },
};

const positionClasses = {
  'top-left': 'top-0 left-0 rounded-br-lg',
  'top-right': 'top-0 right-0 rounded-bl-lg',
  'bottom-left': 'bottom-0 left-0 rounded-tr-lg',
  'bottom-right': 'bottom-0 right-0 rounded-tl-lg',
};

export default function PromoBadge({ type, text, position = 'top-left' }: PromoBadgeProps) {
  const config = badgeConfig[type];

  return (
    <div className={`absolute ${positionClasses[position]} ${config.bg} ${config.text} px-2 py-1 text-xs font-bold`}>
      {text || config.defaultLabel}
    </div>
  );
}
