'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BountyStatus, { StatusTimeline } from '@/components/BountyStatus';
import ApplicationList, { ApplyModal } from '@/components/ApplicationList';
import DeliveryPanel from '@/components/DeliveryPanel';

const mockBounty = {
  id: '1',
  title: '急需开发一个电商小程序，功能完整，UI精美',
  description: '需要开发一个完整的微信小程序，包含商品展示、购物车、订单管理、支付等功能。要求有电商开发经验，代码规范。',
  requirements: `## 功能需求

### 1. 用户模块
- 微信授权登录
- 个人信息管理
- 收货地址管理

### 2. 商品模块
- 商品分类浏览
- 商品搜索
- 商品详情展示
- 商品收藏

### 3. 购物车
- 添加/删除商品
- 修改数量
- 选择规格

### 4. 订单模块
- 下单流程
- 微信支付
- 订单列表
- 订单详情

## 技术要求
- 使用原生小程序或 Taro/uni-app
- 代码规范，有注释
- 提供源码和部署文档

## 交付标准
- 完整可运行的小程序源码
- 后台接口对接完成
- 基本功能测试通过`,
  amount: 5000,
  category: '开发',
  status: 'in_progress' as const,
  deadline: '2026-02-28',
  applicantCount: 12,
  createdAt: '2026-02-20',
  publisher: {
    id: 'p1',
    name: '张老板',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boss1',
    rating: 4.8,
    publishedCount: 15,
  },
  tags: ['小程序', '电商', 'React'],
  urgent: true,
  worker: {
    id: 'w1',
    name: '代码高手',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coder1',
  },
};

export default function BountyDetailPage() {
  const params = useParams();
  const bountyId = params.id as string;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'detail' | 'applications' | 'delivery'>('detail');

  // Mock: 当前用户身份
  const isOwner = false; // 是否是发布者
  const isWorker = true;  // 是否是接单者
  const hasApplied = false;

  const bounty = mockBounty;
  const daysLeft = Math.ceil((new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/bounties" className="hover:text-orange-500">悬赏大厅</Link>
          <span>›</span>
          <span className="text-gray-800">悬赏详情</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BountyStatus status={bounty.status} size="md" />
                      {bounty.urgent && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          ⚡ 加急
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">{bounty.title}</h1>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">悬赏金额</p>
                    <p className="text-3xl font-bold text-red-500">
                      ¥{bounty.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{bounty.description}</p>

                {/* Tags */}
                {bounty.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bounty.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t">
                  <span>📅 发布于 {bounty.createdAt}</span>
                  <span className={daysLeft <= 3 ? 'text-red-500' : ''}>
                    ⏰ {daysLeft > 0 ? `${daysLeft}天后截止` : '已截止'}
                  </span>
                  <span>👥 {bounty.applicantCount}人申请</span>
                </div>
              </div>

              {/* Action Bar */}
              {bounty.status === 'open' && !isOwner && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  {hasApplied ? (
                    <button disabled className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl font-medium cursor-not-allowed">
                      已申请，等待回复
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90"
                    >
                      🙋 立即申请接单
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex border-b">
                {[
                  { id: 'detail', label: '📋 详细需求' },
                  { id: 'applications', label: `👥 申请列表 (${bounty.applicantCount})` },
                  { id: 'delivery', label: '📦 交付管理' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'detail' && (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {bounty.requirements}
                    </pre>
                  </div>
                )}

                {activeTab === 'applications' && (
                  <ApplicationList 
                    applications={[]} 
                    isOwner={isOwner}
                    onAccept={(id) => console.log('Accept', id)}
                    onReject={(id) => console.log('Reject', id)}
                  />
                )}

                {activeTab === 'delivery' && (
                  <DeliveryPanel
                    bountyId={bountyId}
                    isOwner={isOwner}
                    isWorker={isWorker}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publisher Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">👤 发布者</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src={bounty.publisher.avatar} alt="" className="w-14 h-14 rounded-full" />
                <div>
                  <h4 className="font-medium text-gray-800">{bounty.publisher.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span>{bounty.publisher.rating}</span>
                    <span>·</span>
                    <span>发布{bounty.publisher.publishedCount}单</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 border border-orange-400 text-orange-500 rounded-lg hover:bg-orange-50">
                💬 联系发布者
              </button>
            </div>

            {/* Worker Card (if assigned) */}
            {bounty.worker && bounty.status !== 'open' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">🎯 接单者</h3>
                <div className="flex items-center gap-4">
                  <img src={bounty.worker.avatar} alt="" className="w-14 h-14 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-800">{bounty.worker.name}</h4>
                    <span className="text-green-600 text-sm">正在处理中</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <StatusTimeline currentStatus={bounty.status} />
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ 安全提醒</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 所有交易请在平台内完成</li>
                <li>• 不要私下转账或交易</li>
                <li>• 遇到问题请联系客服</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={(data) => console.log('Apply', data)}
        bountyTitle={bounty.title}
      />
    </div>
  );
}
