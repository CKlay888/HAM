'use client';

import { useState } from 'react';

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

interface Application {
  id: string;
  applicant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedBounties: number;
  };
  message: string;
  proposedAmount?: number;
  estimatedDays: number;
  status: ApplicationStatus;
  createdAt: string;
}

interface ApplicationListProps {
  applications: Application[];
  isOwner?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待处理', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  accepted: { label: '已接受', color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { label: '已拒绝', color: 'text-red-600', bg: 'bg-red-100' },
  withdrawn: { label: '已撤回', color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function ApplicationList({ 
  applications, 
  isOwner = false,
  onAccept,
  onReject 
}: ApplicationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">暂无申请</h3>
        <p className="text-gray-500">还没有人申请这个悬赏</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">👥 申请列表 ({applications.length})</h3>
      </div>

      {applications.map((app) => {
        const status = statusConfig[app.status];
        const isExpanded = expandedId === app.id;

        return (
          <div key={app.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(isExpanded ? null : app.id)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <img 
                  src={app.applicant.avatar} 
                  alt={app.applicant.name} 
                  className="w-12 h-12 rounded-full"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">{app.applicant.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>⭐ {app.applicant.rating}</span>
                    <span>✅ 完成{app.applicant.completedBounties}单</span>
                    <span>⏱️ 预计{app.estimatedDays}天</span>
                  </div>
                </div>

                {/* Price & Expand */}
                <div className="text-right">
                  {app.proposedAmount && (
                    <p className="text-lg font-bold text-red-500">¥{app.proposedAmount}</p>
                  )}
                  <span className="text-gray-400 text-sm">{app.createdAt}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                <h5 className="font-medium text-gray-700 mb-2">申请说明</h5>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">{app.message}</p>

                {/* Actions */}
                {isOwner && app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => onAccept?.(app.id)}
                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90"
                    >
                      ✓ 接受申请
                    </button>
                    <button
                      onClick={() => onReject?.(app.id)}
                      className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      拒绝
                    </button>
                  </div>
                )}

                {app.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                    <span>✅</span>
                    <span>已接受此申请，请等待对方完成交付</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Apply Modal
interface ApplyModalProps {
  isOpen: boolean;
  bountyTitle: string;
  bountyAmount: number;
  onClose: () => void;
  onSubmit: (data: { message: string; estimatedDays: number; proposedAmount?: number }) => void;
}

export function ApplyModal({ isOpen, bountyTitle, bountyAmount, onClose, onSubmit }: ApplyModalProps) {
  const [message, setMessage] = useState('');
  const [estimatedDays, setEstimatedDays] = useState(7);
  const [proposedAmount, setProposedAmount] = useState<number | ''>(bountyAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('请填写申请说明');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    onSubmit({ 
      message, 
      estimatedDays, 
      proposedAmount: typeof proposedAmount === 'number' ? proposedAmount : undefined 
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📝 申请接单</h2>
        <p className="text-gray-500 text-sm mb-4">悬赏: {bountyTitle}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">申请说明 *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="介绍你的经验、为什么适合这个任务..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预计完成天数</label>
            <select
              value={estimatedDays}
              onChange={e => setEstimatedDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 3, 5, 7, 14, 30].map(d => (
                <option key={d} value={d}>{d}天</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">报价（可选）</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={proposedAmount}
                onChange={e => setProposedAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder={`原价 ¥${bountyAmount}`}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : '提交申请'}
          </button>
        </div>
      </div>
    </div>
  );
}
