'use client';

import Link from 'next/link';

type BountyStatus = 'open' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'expired';

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: BountyStatus;
  deadline: string;
  applicantCount: number;
  createdAt: string;
  publisher: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  urgent?: boolean;
}

interface BountyCardProps {
  bounty: Bounty;
  variant?: 'default' | 'compact' | 'detailed';
}

const statusConfig: Record<BountyStatus, { label: string; color: string; bg: string }> = {
  open: { label: '招募中', color: 'text-green-600', bg: 'bg-green-100' },
  in_progress: { label: '进行中', color: 'text-blue-600', bg: 'bg-blue-100' },
  delivered: { label: '待验收', color: 'text-orange-600', bg: 'bg-orange-100' },
  completed: { label: '已完成', color: 'text-gray-600', bg: 'bg-gray-100' },
  cancelled: { label: '已取消', color: 'text-red-600', bg: 'bg-red-100' },
  expired: { label: '已过期', color: 'text-gray-500', bg: 'bg-gray-100' },
};

const categoryIcons: Record<string, string> = {
  '开发': '💻',
  '设计': '🎨',
  '文案': '✍️',
  '数据': '📊',
  '翻译': '🌍',
  '其他': '📦',
};

export default function BountyCard({ bounty, variant = 'default' }: BountyCardProps) {
  const status = statusConfig[bounty.status];
  const daysLeft = Math.ceil((new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft <= 3 && bounty.status === 'open';

  if (variant === 'compact') {
    return (
      <Link href={`/bounties/${bounty.id}`} className="block">
        <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
            <span className="text-red-500 font-bold">¥{bounty.amount}</span>
          </div>
          <h3 className="font-medium text-gray-800 truncate">{bounty.title}</h3>
          <p className="text-gray-500 text-sm mt-1">截止: {bounty.deadline}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/bounties/${bounty.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group-hover:border-orange-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{categoryIcons[bounty.category] || '📦'}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
                {isUrgent && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white animate-pulse">
                    🔥 紧急
                  </span>
                )}
                {bounty.urgent && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    ⚡ 加急
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-800 text-lg group-hover:text-orange-500 transition-colors line-clamp-2">
                {bounty.title}
              </h3>
            </div>
            
            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">悬赏金额</p>
              <p className="text-2xl font-bold text-red-500">
                ¥<span className="text-3xl">{bounty.amount.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{bounty.description}</p>
          
          {/* Tags */}
          {bounty.tags && bounty.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {bounty.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <img src={bounty.publisher.avatar} alt="" className="w-6 h-6 rounded-full" />
              <span className="text-gray-600">{bounty.publisher.name}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <span>👥</span>
                <span>{bounty.applicantCount}人申请</span>
              </span>
              <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500' : ''}`}>
                <span>⏰</span>
                <span>{daysLeft > 0 ? `${daysLeft}天后截止` : '已截止'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Featured Bounty Card
export function FeaturedBountyCard({ bounty }: { bounty: Bounty }) {
  return (
    <Link href={`/bounties/${bounty.id}`} className="block">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-white/20 rounded-full text-sm">🏆 精选悬赏</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{bounty.title}</h3>
        <p className="text-white/80 text-sm mb-4 line-clamp-2">{bounty.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={bounty.publisher.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <span>{bounty.publisher.name}</span>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">悬赏金额</p>
            <p className="text-3xl font-bold">¥{bounty.amount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
