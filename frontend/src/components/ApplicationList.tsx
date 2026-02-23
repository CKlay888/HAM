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
    completedCount: number;
  };
  message: string;
  expectedDays: number;
  status: ApplicationStatus;
  appliedAt: string;
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

const mockApplications: Application[] = [
  {
    id: '1',
    applicant: {
      id: 'u1',
      name: '代码高手',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coder1',
      rating: 4.9,
      completedCount: 56,
    },
    message: '您好！我有5年全栈开发经验，精通React、Node.js等技术栈。之前完成过类似的项目，可以在3天内交付高质量的代码。期待与您合作！',
    expectedDays: 3,
    status: 'pending',
    appliedAt: '2026-02-23 10:30',
  },
  {
    id: '2',
    applicant: {
      id: 'u2',
      name: '设计师小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      rating: 4.7,
      completedCount: 32,
    },
    message: '我是专业UI设计师，可以提供高质量的设计方案。预计5天完成，包含3轮修改。',
    expectedDays: 5,
    status: 'pending',
    appliedAt: '2026-02-23 11:15',
  },
  {
    id: '3',
    applicant: {
      id: 'u3',
      name: '技术专家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert',
      rating: 5.0,
      completedCount: 128,
    },
    message: '资深工程师，保证质量和速度。2天内搞定！',
    expectedDays: 2,
    status: 'accepted',
    appliedAt: '2026-02-23 09:00',
  },
];

export default function ApplicationList({ 
  applications = mockApplications, 
  isOwner = true,
  onAccept,
  onReject 
}: ApplicationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800">👥 申请列表</h3>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {pendingCount}待处理
            </span>
          )}
        </div>
        <span className="text-gray-500 text-sm">共 {applications.length} 人申请</span>
      </div>

      <div className="divide-y divide-gray-100">
        {applications.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <span className="text-4xl block mb-2">📭</span>
            暂无申请
          </div>
        ) : (
          applications.map((app) => {
            const status = statusConfig[app.status];
            const isExpanded = expandedId === app.id;

            return (
              <div key={app.id} className={`p-4 ${app.status === 'accepted' ? 'bg-green-50' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img 
                    src={app.applicant.avatar} 
                    alt={app.applicant.name}
                    className="w-12 h-12 rounded-full"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{app.applicant.name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {app.applicant.rating}
                      </span>
                      <span>完成 {app.applicant.completedCount} 单</span>
                      <span>预计 {app.expectedDays} 天</span>
                    </div>

                    {/* Message Preview/Full */}
                    <p className={`text-gray-600 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {app.message}
                    </p>
                    {app.message.length > 100 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="text-orange-500 text-sm hover:underline mt-1"
                      >
                        {isExpanded ? '收起' : '展开全部'}
                      </button>
                    )}

                    <p className="text-gray-400 text-xs mt-2">申请于 {app.appliedAt}</p>
                  </div>

                  {/* Actions */}
                  {isOwner && app.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onAccept?.(app.id)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
                      >
                        接受
                      </button>
                      <button
                        onClick={() => onReject?.(app.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                      >
                        拒绝
                      </button>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <div className="text-center">
                      <span className="text-green-500 text-2xl">✓</span>
                      <p className="text-green-600 text-xs">已选中</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Apply Modal
interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { message: string; expectedDays: number }) => void;
  bountyTitle: string;
}

export function ApplyModal({ isOpen, onClose, onSubmit, bountyTitle }: ApplyModalProps) {
  const [message, setMessage] = useState('');
  const [expectedDays, setExpectedDays] = useState(3);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (message.trim().length < 20) {
      setError('申请说明至少20个字');
      return;
    }
    onSubmit({ message, expectedDays });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📝 申请接单</h3>
        <p className="text-gray-500 text-sm mb-4">悬赏: {bountyTitle}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">申请说明 *</label>
            <textarea
              value={message}
              onChange={e => { setMessage(e.target.value); setError(''); }}
              rows={4}
              placeholder="介绍你的相关经验，为什么适合这个任务..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                error ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预计完成天数</label>
            <select
              value={expectedDays}
              onChange={e => setExpectedDays(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 5, 7, 10, 14, 30].map(d => (
                <option key={d} value={d}>{d} 天</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50">
            取消
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90">
            提交申请
          </button>
        </div>
      </div>
    </div>
  );
}
