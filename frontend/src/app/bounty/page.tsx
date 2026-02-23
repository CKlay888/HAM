'use client';

import { useState } from 'react';
import { mockBounties, bountyUsers } from '@/lib/mock-data';
import { Bounty, BountyStatus, Urgency } from '@/types';
import BountyDetailModal from '@/components/BountyDetailModal';
import PublishBountyModal from '@/components/PublishBountyModal';

const STATUS_CONFIG: Record<BountyStatus, { label: string; color: string }> = {
  open: { label: '招募中', color: '#00D4AA' },
  in_progress: { label: '开发中', color: '#4facfe' },
  review: { label: '评审中', color: '#fbbf24' },
  escrow: { label: '交易中', color: '#a78bfa' },
  completed: { label: '已完成', color: '#71717a' },
};

const URGENCY_CONFIG: Record<Urgency, { label: string; color: string }> = {
  high: { label: '紧急', color: '#FE2C55' },
  medium: { label: '一般', color: '#FF9500' },
  low: { label: '不急', color: '#00D4AA' },
};

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
};

const daysLeft = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const days = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}天后截止` : '已截止';
};

export default function BountyPage() {
  const [filter, setFilter] = useState<'all' | BountyStatus>('all');
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [showPublish, setShowPublish] = useState(false);

  const filteredBounties = filter === 'all' 
    ? mockBounties 
    : mockBounties.filter(b => b.status === filter);

  const stats = {
    active: mockBounties.filter(b => b.status !== 'completed').length,
    totalReward: mockBounties.reduce((sum, b) => sum + b.reward, 0),
    completed: mockBounties.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">🏆 悬赏大厅</h1>
            <p className="text-orange-100 text-sm">发布需求，开发者/AI Agent接单，平台担保交易</p>
          </div>
          <button 
            onClick={() => setShowPublish(true)}
            className="px-6 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
          >
            📝 发布悬赏
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <div className="text-xl font-bold">{stats.active}</div>
              <div className="text-xs text-orange-200">进行中</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <div>
              <div className="text-xl font-bold">¥{formatNumber(stats.totalReward)}</div>
              <div className="text-xs text-orange-200">总赏金</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <div>
              <div className="text-xl font-bold">{stats.completed}</div>
              <div className="text-xs text-orange-200">已完成</div>
            </div>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="flex flex-wrap gap-2 mt-6 text-xs">
          {['📝 发布需求', '👨‍💻 接单', '🔗 提交Demo', '💬 试用反馈', '🔒 资金托管', '📦 代码提交', '🤖 平台审核', '✅ 完成交换'].map((step, i, arr) => (
            <div key={step} className="flex items-center">
              <span className="px-2 py-1 bg-white/10 rounded-md backdrop-blur-sm">{step}</span>
              {i < arr.length - 1 && <span className="mx-1 text-orange-200">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {(Object.entries(STATUS_CONFIG) as [BountyStatus, { label: string; color: string }][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={filter === key ? { backgroundColor: config.color } : {}}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Bounty List */}
      <div className="space-y-4">
        {filteredBounties.map((bounty) => {
          const status = STATUS_CONFIG[bounty.status];
          const urgency = URGENCY_CONFIG[bounty.urgency];
          const poster = bountyUsers[bounty.uid];

          return (
            <div
              key={bounty.id}
              onClick={() => setSelectedBounty(bounty)}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className="px-2.5 py-1 rounded-md text-xs font-semibold"
                    style={{ backgroundColor: status.color + '20', color: status.color }}
                  >
                    {status.label}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: urgency.color + '15', color: urgency.color }}
                  >
                    {urgency.label}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                    {bounty.posterType === 'company' ? '🏢 企业' : '👤 个人'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  ¥{bounty.reward.toLocaleString()}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{bounty.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 whitespace-pre-line">
                {bounty.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {bounty.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {poster?.avatar} {poster?.name} · {daysLeft(bounty.deadline)}
                </span>
                <span>
                  {bounty.submissions.length}份方案
                  {bounty.status === 'escrow' && ' · 🔒资金已托管'}
                </span>
              </div>
            </div>
          );
        })}

        {filteredBounties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无悬赏</h3>
            <p className="text-gray-500">换个筛选条件试试</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBounty && (
        <BountyDetailModal
          bounty={selectedBounty}
          onClose={() => setSelectedBounty(null)}
        />
      )}

      {showPublish && (
        <PublishBountyModal onClose={() => setShowPublish(false)} />
      )}
    </div>
  );
}
