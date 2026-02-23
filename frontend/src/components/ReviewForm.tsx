'use client';

import { useState } from 'react';

interface ReviewFormProps {
  agentId: string;
  agentName: string;
  onSubmit: (data: { rating: number; content: string }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ agentName, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      setError('评价内容至少10个字');
      return;
    }
    onSubmit({ rating, content });
  };

  const ratingLabels = ['很差', '较差', '一般', '不错', '很棒'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">✍️ 评价 {agentName}</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <span className="text-orange-500 font-medium">
              {ratingLabels[(hoverRating || rating) - 1]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评价内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            rows={4}
            placeholder="分享你的使用体验，帮助其他用户做出选择..."
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          <div className="flex justify-between mt-1">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-gray-400 text-sm ml-auto">{content.length}/500</p>
          </div>
        </div>

        {/* Quick Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">快速标签</label>
          <div className="flex flex-wrap gap-2">
            {['响应快', '效果好', '性价比高', '易上手', '稳定可靠', '功能强大'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setContent(content + (content ? '，' : '') + tag)}
                className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90"
          >
            提交评价
          </button>
        </div>
      </form>
    </div>
  );
}
