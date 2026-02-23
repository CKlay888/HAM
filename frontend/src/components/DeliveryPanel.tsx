'use client';

import { useState } from 'react';

type DeliveryStatus = 'not_started' | 'in_progress' | 'submitted' | 'revision_requested' | 'accepted' | 'completed';

interface Delivery {
  id: string;
  status: DeliveryStatus;
  content?: string;
  attachments?: Array<{ name: string; url: string; size: string }>;
  submittedAt?: string;
  feedback?: string;
  revisionCount: number;
}

interface DeliveryPanelProps {
  delivery: Delivery;
  isOwner: boolean;
  isWorker: boolean;
  onSubmitDelivery?: (content: string, files: File[]) => void;
  onRequestRevision?: (feedback: string) => void;
  onAcceptDelivery?: () => void;
  onCompletePayment?: () => void;
}

const statusConfig: Record<DeliveryStatus, { label: string; icon: string; color: string; bg: string }> = {
  not_started: { label: '未开始', icon: '⏳', color: 'text-gray-600', bg: 'bg-gray-100' },
  in_progress: { label: '进行中', icon: '🔨', color: 'text-blue-600', bg: 'bg-blue-100' },
  submitted: { label: '已提交', icon: '📤', color: 'text-orange-600', bg: 'bg-orange-100' },
  revision_requested: { label: '需修改', icon: '🔄', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  accepted: { label: '已验收', icon: '✅', color: 'text-green-600', bg: 'bg-green-100' },
  completed: { label: '已完成', icon: '🎉', color: 'text-green-600', bg: 'bg-green-100' },
};

export default function DeliveryPanel({
  delivery,
  isOwner,
  isWorker,
  onSubmitDelivery,
  onRequestRevision,
  onAcceptDelivery,
  onCompletePayment,
}: DeliveryPanelProps) {
  const [deliveryContent, setDeliveryContent] = useState(delivery.content || '');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = statusConfig[delivery.status];

  const handleSubmitDelivery = async () => {
    if (!deliveryContent.trim()) {
      alert('请填写交付内容');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    onSubmitDelivery?.(deliveryContent, []);
    setIsSubmitting(false);
  };

  const handleRequestRevision = async () => {
    if (!revisionFeedback.trim()) {
      alert('请填写修改意见');
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    onRequestRevision?.(revisionFeedback);
    setShowRevisionForm(false);
    setRevisionFeedback('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{status.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">交付管理</h3>
            <span className={`text-sm ${status.color}`}>{status.label}</span>
          </div>
        </div>
        {delivery.revisionCount > 0 && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
            已修改 {delivery.revisionCount} 次
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Worker View - Submit Delivery */}
        {isWorker && (delivery.status === 'in_progress' || delivery.status === 'revision_requested') && (
          <div className="space-y-4">
            {delivery.status === 'revision_requested' && delivery.feedback && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">📝 修改意见</h4>
                <p className="text-yellow-700">{delivery.feedback}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">交付内容</label>
              <textarea
                value={deliveryContent}
                onChange={e => setDeliveryContent(e.target.value)}
                placeholder="描述你的交付内容，包括完成情况、相关链接等..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">附件（可选）</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
                <div className="text-4xl mb-2">📎</div>
                <p className="text-gray-500">点击或拖拽上传文件</p>
                <p className="text-gray-400 text-sm mt-1">支持 zip, rar, pdf, doc 等格式</p>
              </div>
            </div>

            <button
              onClick={handleSubmitDelivery}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? '提交中...' : '📤 提交交付'}
            </button>
          </div>
        )}

        {/* Owner View - Review Delivery */}
        {isOwner && delivery.status === 'submitted' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-2">交付内容</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{delivery.content}</p>
            </div>

            {delivery.attachments && delivery.attachments.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">附件</h4>
                <div className="space-y-2">
                  {delivery.attachments.map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <span>📎</span>
                      <span className="flex-1 text-gray-700">{file.name}</span>
                      <span className="text-gray-400 text-sm">{file.size}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!showRevisionForm ? (
              <div className="flex gap-3">
                <button
                  onClick={onAcceptDelivery}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90"
                >
                  ✅ 验收通过
                </button>
                <button
                  onClick={() => setShowRevisionForm(true)}
                  className="flex-1 py-3 border border-orange-300 text-orange-500 rounded-xl font-medium hover:bg-orange-50"
                >
                  🔄 要求修改
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={revisionFeedback}
                  onChange={e => setRevisionFeedback(e.target.value)}
                  placeholder="请详细说明需要修改的地方..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isSubmitting ? '提交中...' : '提交修改意见'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Accepted - Payment */}
        {delivery.status === 'accepted' && isOwner && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">交付已验收</h4>
            <p className="text-gray-500 mb-6">请确认支付以完成悬赏</p>
            <button
              onClick={onCompletePayment}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90"
            >
              💰 确认支付
            </button>
          </div>
        )}

        {/* Completed */}
        {delivery.status === 'completed' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">悬赏已完成</h4>
            <p className="text-gray-500">感谢使用HAM悬赏系统</p>
          </div>
        )}

        {/* Waiting */}
        {isWorker && delivery.status === 'submitted' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">等待发布者验收</h4>
            <p className="text-gray-500">已提交交付，请耐心等待</p>
            {delivery.submittedAt && (
              <p className="text-gray-400 text-sm mt-2">提交时间: {delivery.submittedAt}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
