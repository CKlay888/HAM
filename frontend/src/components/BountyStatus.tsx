'use client';

type BountyStatus = 'open' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'expired';

interface BountyStatusProps {
  status: BountyStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<BountyStatus, { 
  label: string; 
  icon: string;
  color: string; 
  bg: string;
  border: string;
  description: string;
}> = {
  open: { 
    label: '招募中', 
    icon: '🟢',
    color: 'text-green-600', 
    bg: 'bg-green-100',
    border: 'border-green-300',
    description: '正在招募接单者'
  },
  in_progress: { 
    label: '进行中', 
    icon: '🔵',
    color: 'text-blue-600', 
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    description: '已有人接单，正在进行'
  },
  delivered: { 
    label: '待验收', 
    icon: '🟠',
    color: 'text-orange-600', 
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    description: '已交付，等待发布者验收'
  },
  completed: { 
    label: '已完成', 
    icon: '✅',
    color: 'text-gray-600', 
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    description: '悬赏已完成'
  },
  cancelled: { 
    label: '已取消', 
    icon: '❌',
    color: 'text-red-600', 
    bg: 'bg-red-100',
    border: 'border-red-300',
    description: '悬赏已取消'
  },
  expired: { 
    label: '已过期', 
    icon: '⏰',
    color: 'text-gray-500', 
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    description: '已超过截止日期'
  },
};

export default function BountyStatus({ status, size = 'md', showIcon = true }: BountyStatusProps) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
}

// Status Timeline
interface StatusTimelineProps {
  currentStatus: BountyStatus;
  events?: Array<{ status: BountyStatus; time: string; note?: string }>;
}

export function StatusTimeline({ currentStatus, events = [] }: StatusTimelineProps) {
  const allStatuses: BountyStatus[] = ['open', 'in_progress', 'delivered', 'completed'];
  const currentIndex = allStatuses.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-800">📋 状态进度</h4>
      <div className="flex items-center justify-between">
        {allStatuses.map((status, index) => {
          const config = statusConfig[status];
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status} className="flex flex-col items-center flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? `${config.bg} ${config.color}` : 'bg-gray-200 text-gray-400'}
              `}>
                {isCompleted ? '✓' : config.icon}
              </div>
              <p className={`text-xs mt-1 ${isCurrent ? config.color : 'text-gray-500'}`}>
                {config.label}
              </p>
              {index < allStatuses.length - 1 && (
                <div className={`absolute w-full h-0.5 top-4 left-1/2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Event Log */}
      {events.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-800">📝 操作记录</h4>
          {events.map((event, index) => (
            <div key={index} className="flex gap-3 text-sm">
              <span className="text-gray-400">{event.time}</span>
              <BountyStatus status={event.status} size="sm" />
              {event.note && <span className="text-gray-600">{event.note}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick Status Filter
interface StatusFilterProps {
  selectedStatus: BountyStatus | 'all';
  onChange: (status: BountyStatus | 'all') => void;
  counts?: Record<string, number>;
}

export function StatusFilter({ selectedStatus, onChange, counts = {} }: StatusFilterProps) {
  const statuses: Array<{ value: BountyStatus | 'all'; label: string }> = [
    { value: 'all', label: '全部' },
    { value: 'open', label: '招募中' },
    { value: 'in_progress', label: '进行中' },
    { value: 'delivered', label: '待验收' },
    { value: 'completed', label: '已完成' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {statuses.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${selectedStatus === value 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {label}
          {counts[value] !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              selectedStatus === value ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {counts[value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
