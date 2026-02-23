'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockAgents, mockPricingPlans, mockReviews } from '@/lib/mock-data';
import ReliabilityBadge from '@/components/ReliabilityBadge';
import AgentCard from '@/components/AgentCard';

export default function AgentDetailPage() {
  const params = useParams();
  const agent = mockAgents.find((a) => a.id === params.id) || mockAgents[0];
  const [selectedPlan, setSelectedPlan] = useState(mockPricingPlans[1].id);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // 相关 Agent 推荐（同分类，排除当前）
  const relatedAgents = mockAgents
    .filter((a) => a.category === agent.category && a.id !== agent.id)
    .slice(0, 3);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // TODO: 调用购买 API
    await new Promise((r) => setTimeout(r, 1000));
    alert('购买成功！');
    setIsPurchasing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">市场</Link>
        <span>/</span>
        <span className="text-gray-900">{agent.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card - 名称、描述 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-xl bg-gray-100" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                  {agent.isVerified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{agent.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-gray-400">({agent.reviewCount} 评价)</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{(agent.callCount / 1000).toFixed(1)}k 次调用</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">{agent.category}</span>
              {agent.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 详细介绍</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{agent.description}</p>
            <h3 className="font-semibold text-gray-900 mb-2">核心能力</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((cap) => (
                <span key={cap} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg">✓ {cap}</span>
              ))}
            </div>
          </div>

          {/* Reliability Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 可靠性指标</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-center mb-2">
                  <ReliabilityBadge grade={agent.reliabilityGrade} size="lg" />
                </div>
                <p className="text-sm text-gray-500">可靠性等级</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{agent.successRate}%</p>
                <p className="text-sm text-gray-500">成功率</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{agent.avgResponseTime}s</p>
                <p className="text-sm text-gray-500">平均响应</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">{agent.uptime}%</p>
                <p className="text-sm text-gray-500">30天在线率</p>
              </div>
            </div>
          </div>

          {/* Reviews - 评分和评论 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">💬 用户评价</h2>
              <button className="text-blue-600 text-sm hover:underline">查看全部</button>
            </div>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{agent.rating}</p>
                <div className="flex items-center justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(agent.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{agent.reviewCount} 条评价</p>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">{review.createdAt}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.content}</p>
                      <button className="text-gray-400 text-sm mt-2 hover:text-blue-600">👍 有用 ({review.helpful})</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Agents - 相关推荐 */}
          {relatedAgents.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🔗 相关推荐</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedAgents.map((related) => (
                  <AgentCard key={related.id} agent={related} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Pricing & Purchase */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 价格</h2>
            
            {/* Pricing Plans */}
            <div className="space-y-3 mb-6">
              {mockPricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.isRecommended && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">推荐</span>
                  )}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">¥{plan.price}</span>
                      <span className="text-gray-500 text-sm">/{plan.unit}</span>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity mb-3 disabled:opacity-50"
            >
              {isPurchasing ? '处理中...' : '立即购买'}
            </button>
            
            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              免费试用
            </button>

            {/* Creator Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">开发者</p>
              <div className="flex items-center gap-3">
                <img src={agent.creatorAvatar} alt={agent.creatorName} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{agent.creatorName}</p>
                  <p className="text-sm text-gray-500">已发布 12 个 Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
