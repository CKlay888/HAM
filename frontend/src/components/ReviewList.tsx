'use client';

import { useState } from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful: number;
  reply?: { content: string; createdAt: string };
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: '代码小王子',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prince',
    rating: 5,
    content: '非常好用！代码生成质量很高，帮我节省了很多时间。响应速度也很快，强烈推荐给所有开发者！',
    createdAt: '2026-02-22',
    helpful: 23,
    reply: { content: '感谢您的认可！我们会继续努力提升服务质量～', createdAt: '2026-02-23' }
  },
  {
    id: '2',
    userName: '文案达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=writer',
    rating: 4,
    content: '整体不错，偶尔会有些小bug，但客服响应很及时。期待后续版本优化。',
    createdAt: '2026-02-20',
    helpful: 15,
  },
  {
    id: '3',
    userName: '数据分析师',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst',
    rating: 5,
    content: '数据处理能力很强，图表生成也很专业。性价比很高！',
    createdAt: '2026-02-18',
    helpful: 8,
  },
];

interface ReviewListProps {
  reviews?: Review[];
  showReply?: boolean;
}

export default function ReviewList({ reviews = mockReviews, showReply = true }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'helpful'>('latest');
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const handleHelpful = (id: string) => {
    setHelpfulClicked(prev => new Set([...prev, id]));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-800">📝 用户评价</h3>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-bold text-gray-800">{avgRating}</span>
              <span className="text-gray-400 text-sm">({reviews.length}条评价)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">排序:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'latest' | 'helpful')}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none"
            >
              <option value="latest">最新</option>
              <option value="helpful">最有帮助</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="divide-y divide-gray-100">
        {sortedReviews.map((review) => (
          <div key={review.id} className="px-6 py-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="font-medium text-gray-800">{review.userName}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs">{review.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 mb-3">{review.content}</p>

            {/* Reply */}
            {showReply && review.reply && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 ml-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-500 text-sm font-medium">开发者回复</span>
                  <span className="text-gray-400 text-xs">{review.reply.createdAt}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.reply.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulClicked.has(review.id)}
                className={`flex items-center gap-1 text-sm ${
                  helpfulClicked.has(review.id) 
                    ? 'text-orange-500' 
                    : 'text-gray-400 hover:text-orange-500'
                }`}
              >
                <span>👍</span>
                <span>有帮助 ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})</span>
              </button>
              <button className="text-gray-400 text-sm hover:text-gray-600">
                举报
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="px-6 py-4 border-t text-center">
        <button className="text-orange-500 text-sm hover:underline">
          加载更多评价 ↓
        </button>
      </div>
    </div>
  );
}
