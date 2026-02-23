'use client';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-orange-100 text-orange-700',
  secondary: 'bg-gray-200 text-gray-800',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-orange-500',
  secondary: 'bg-gray-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  dot = false,
  removable = false,
  onRemove,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Notification Badge (number)
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  showZero = false,
  dot = false,
  children,
  className = '',
}: NotificationBadgeProps) {
  const show = count > 0 || showZero;
  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      {show && (
        dot ? (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        ) : (
          <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
            {displayCount}
          </span>
        )
      )}
    </div>
  );
}

// Status Badge
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'active' | 'inactive' | 'pending';
  text?: string;
  size?: BadgeSize;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  online: { color: 'bg-green-500', bg: 'bg-green-100 text-green-700', label: '在线' },
  offline: { color: 'bg-gray-400', bg: 'bg-gray-100 text-gray-600', label: '离线' },
  busy: { color: 'bg-red-500', bg: 'bg-red-100 text-red-700', label: '忙碌' },
  away: { color: 'bg-yellow-500', bg: 'bg-yellow-100 text-yellow-700', label: '离开' },
  active: { color: 'bg-green-500', bg: 'bg-green-100 text-green-700', label: '活跃' },
  inactive: { color: 'bg-gray-400', bg: 'bg-gray-100 text-gray-600', label: '未激活' },
  pending: { color: 'bg-yellow-500', bg: 'bg-yellow-100 text-yellow-700', label: '待处理' },
};

export function StatusBadge({ status, text, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      {text || config.label}
    </span>
  );
}

// Tag Badge (for categories)
interface TagBadgeProps {
  tags: string[];
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function TagBadge({ tags, max = 3, variant = 'default', size = 'sm' }: TagBadgeProps) {
  const visibleTags = tags.slice(0, max);
  const remaining = tags.length - max;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag, index) => (
        <Badge key={index} variant={variant} size={size}>
          {tag}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary" size={size}>
          +{remaining}
        </Badge>
      )}
    </div>
  );
}
