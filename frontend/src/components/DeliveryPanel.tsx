'use client';

import { useState } from 'react';

type DeliveryStatus = 'pending' | 'submitted' | 'revision' | 'approved' | 'rejected';

interface Delivery {
  id: string;
  version: number;
  content: string;
  attachments: Array<{ name: string; url: string; size: string }>;
  submittedAt: string;
  status: DeliveryStatus;
  feedback?: string;
}

interface DeliveryPanelProps {
  bountyId: string;
  isWorker?: boolean;  // 接单者
  isOwner?: boolean;   // 发布者
  deliveries?: Delivery[];
  onSubmitDelivery?: (data: { content: string; files: File[] }) => void;
  onApprove?: (deliveryId: string) => void;
  onRequestRevision?: (deliveryId: string, feedback: string) => void;
  onReject?: (deliveryId: string, reason: string) => void;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    version: 1,
    content: '第一版交付：\n\n1. 完成了核心功能开发\n2. 包含完整的文档\n3. 已进行基础测试\n\n请查收并给出反馈。',
    attachments: [
      { name: 'project-v1.zip', url: '#', size: '2.3MB' },
      { name: 'README.md', url: '#', size: '8KB' },
    ],
    submittedAt: '2026-02-22 14:30',
    status: 'revision',
    feedback: '整体不错，但还需要修改以下几点：1. 首页加载速度需要优化；2. 移动端适配还有问题',
  },
  {
    id: 'd2',
    version: 2,
    content: '第二版交付：\n\n已根据反馈进行修改：\n1. 优化了首页加载速度，现在<2秒\n2. 修复了所有移动端适配问题\n3. 额外添加了暗黑模式支持',
    attachments: [
      { name: 'project-v2.zip', url: '#', size: '2.5MB' },
      { name: 'CHANGELOG.md', url: '#', size: '3KB' },
    ],
    submittedAt: '2026-02-23 10:00',
    status: 'pending',
  },
];

const statusConfig: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: '待验收', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⏳' },
  submitted: { label: '已提交', color: 'text-blue-600', bg: 'bg-blue-100', icon: '📤' },
  revision: { label: '需修改', color: 'text-orange-600', bg: 'bg-orange-100', icon: '✏️' },
  approved: { label: '已通过', color: 'text-green-600', bg: 'bg-green-100', icon: '✅' },
  rejected: { label: '已拒绝', color: 'text-red-600', bg: 'bg-red-100', icon: '❌' },
};

export default function DeliveryPanel({
  isWorker = false,
  isOwner = false,
  deliveries = mockDeliveries,
  onSubmitDelivery,
  onApprove,
  onRequestRevision,
  onReject,
}: DeliveryPanelProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitContent, setSubmitContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [feedbackModal, setFeedbackModal] = useState<{ type: 'revision' | 'reject'; deliveryId: string } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const latestDelivery = deliveries[deliveries.length - 1];
  const canSubmit = isWorker && (!latestDelivery || latestDelivery.status === 'revision');
  const canReview = isOwner && latestDelivery?.status === 'pending';

  const handleSubmit = () => {
    if (!submitContent.trim()) return;
    onSubmitDelivery?.({ content: submitContent, files });
    setSubmitContent('');
    setFiles([]);
    setShowSubmitForm(false);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackModal || !feedbackText.trim()) return;
    if (feedbackModal.type === 'revision') {
      onRequestRevision?.(feedbackModal.deliveryId, feedbackText);
    } else {
      onReject?.(feedbackModal.deliveryId, feedbackText);
    }
    setFeedbackModal(null);
    setFeedbackText('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-bold text-gray-800">📦 交付管理</h3>
        {canSubmit && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            + 提交交付
          </button>
        )}
      </div>

      {/* Submit Form */}
      {showSubmitForm && (
        <div className="p-6 bg-orange-50 border-b">
          <h4 className="font-medium text-gray-800 mb-4">📤 提交交付内容</h4>
          <textarea
            value={submitContent}
            onChange={e => setSubmitContent(e.target.value)}
            rows={4}
            placeholder="描述你的交付内容..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">附件</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                onChange={e => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-4xl block mb-2">📎</span>
                <span className="text-gray-600">点击或拖拽上传文件</span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📄</span>
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024).toFixed(1)}KB)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSubmitForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90"
            >
              确认提交
            </button>
          </div>
        </div>
      )}

      {/* Delivery History */}
      <div className="divide-y divide-gray-100">
        {deliveries.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <span className="text-4xl block mb-2">📭</span>
            暂无交付记录
          </div>
        ) : (
          [...deliveries].reverse().map((delivery) => {
            const status = statusConfig[delivery.status];
            
            return (
              <div key={delivery.id} className={`p-6 ${delivery.status === 'approved' ? 'bg-green-50' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{status.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">第 {delivery.version} 版交付</h4>
                      <span className="text-gray-400 text-sm">{delivery.submittedAt}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans">{delivery.content}</pre>
                </div>

                {/* Attachments */}
                {delivery.attachments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">📎 附件</p>
                    <div className="flex flex-wrap gap-2">
                      {delivery.attachments.map((file, i) => (
                        <a
                          key={i}
                          href={file.url}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                        >
                          <span>📄</span>
                          <span>{file.name}</span>
                          <span className="text-gray-400">({file.size})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {delivery.feedback && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-orange-700 mb-1">💬 发布者反馈</p>
                    <p className="text-gray-700 text-sm">{delivery.feedback}</p>
                  </div>
                )}

                {/* Actions for Owner */}
                {isOwner && delivery.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => onApprove?.(delivery.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90"
                    >
                      ✅ 验收通过
                    </button>
                    <button
                      onClick={() => setFeedbackModal({ type: 'revision', deliveryId: delivery.id })}
                      className="flex-1 py-3 border border-orange-400 text-orange-500 rounded-xl font-medium hover:bg-orange-50"
                    >
                      ✏️ 要求修改
                    </button>
                    <button
                      onClick={() => setFeedbackModal({ type: 'reject', deliveryId: delivery.id })}
                      className="px-6 py-3 border border-red-400 text-red-500 rounded-xl font-medium hover:bg-red-50"
                    >
                      ❌ 拒绝
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFeedbackModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {feedbackModal.type === 'revision' ? '✏️ 要求修改' : '❌ 拒绝交付'}
            </h3>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              rows={4}
              placeholder={feedbackModal.type === 'revision' ? '说明需要修改的内容...' : '说明拒绝的原因...'}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setFeedbackModal(null)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className={`flex-1 py-3 rounded-xl font-medium text-white ${
                  feedbackModal.type === 'revision' 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
