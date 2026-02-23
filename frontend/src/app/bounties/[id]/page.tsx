'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BountyStatus from '@/components/BountyStatus';
import ApplicationList, { ApplyModal } from '@/components/ApplicationList';
import DeliveryPanel from '@/components/DeliveryPanel';

// Mock Data
const mockBounty = {
  id: '1',
  title: '开发一个React数据可视化组件库',
  description: '需要包含折线图、柱状图、饼图等常用图表，支持响应式和主题定制，使用TypeScript开发。',
  requirements: `## 功能要求

1. **基础图表**
   - 折线图 (Line Chart)
   - 柱状图 (Bar Chart) 
   - 饼图 (Pie Chart)
   - 面积图 (Area Chart)

2. **高级特性**
   - 支持响应式布局
   - 支持明暗主题切换
   - 支持数据动画
   - 支持图例和提示框

3. **技术要求**
   - 使用 TypeScript 开发
   - 使用 D3.js 或 ECharts 作为底层
   - 提供完整的类型定义
   - 提供 Storybook 文档

## 交付物

- GitHub 仓库源码
- npm 包发布
- 使用文档
- 示例代码`,
  amount: 5000,
  category: '开发',
  status: 'in_progress' as const,
  deadline: '2026-03-15',
  applicantCount: 12,
  createdAt: '2026-02-20',
  publisher: { 
    id: 'u1',
    name: '张三', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    rating: 4.8,
    bountyCount: 15,
  },
  tags: ['React', 'TypeScript', 'D3.js', '数据可视化'],
  urgent: true,
  viewCount: 256,
};

const mockApplications = [
  {
    id: 'a1',
    applicant: { id: 'u2', name: '代码小王子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prince', rating: 4.9, completedBounties: 28 },
    message: '我有5年React开发经验，熟悉D3.js和数据可视化，之前做过类似的组件库项目。可以在2周内交付高质量代码。',
    proposedAmount: 4500,
    estimatedDays: 14,
    status: 'accepted' as const,
    createdAt: '2026-02-21',
  },
  {
    id: 'a2',
    applicant: { id: 'u3', name: '前端工程师小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoli', rating: 4.7, completedBounties: 15 },
    message: '熟悉ECharts和图表开发，有丰富的TypeScript经验。',
    estimatedDays: 10,
    status: 'rejected' as const,
    createdAt: '2026-02-21',
  },
];

const mockDelivery = {
  id: 'd1',
  status: 'in_progress' as const,
  revisionCount: 0,
};

export default function BountyDetailPage() {
  const params = useParams();
  const bountyId = params.id as string;
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Mock: Check if current user is owner or worker
  const isOwner = false;
  const isWorker = true;
  const hasApplied = true;
  const isLoggedIn = true;

  const daysLeft = Math.ceil((new Date(mockBounty.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/bounties" className="text-gray-500 hover:text-orange-500 text-sm">
            ← 返回悬赏大厅
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BountyStatus status={mockBounty.status} />
                    {mockBounty.urgent && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">⚡ 加急</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">{mockBounty.title}</h1>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockBounty.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>👁️ {mockBounty.viewCount} 浏览</span>
                <span>👥 {mockBounty.applicantCount} 人申请</span>
                <span>📅 发布于 {mockBounty.createdAt}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">📋 需求描述</h2>
              <p className="text-gray-700 leading-relaxed">{mockBounty.description}</p>
            </div>

            {/* Requirements */}
            {mockBounty.requirements && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">📝 详细需求</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                    {mockBounty.requirements}
                  </pre>
                </div>
              </div>
            )}

            {/* Applications (Owner View) */}
            {isOwner && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ApplicationList 
                  applications={mockApplications}
                  isOwner={isOwner}
                  onAccept={(id) => console.log('Accept', id)}
                  onReject={(id) => console.log('Reject', id)}
                />
              </div>
            )}

            {/* Delivery Panel (Worker View) */}
            {(isWorker || isOwner) && mockBounty.status !== 'open' && (
              <DeliveryPanel
                delivery={mockDelivery}
                isOwner={isOwner}
                isWorker={isWorker}
                onSubmitDelivery={(content) => console.log('Submit', content)}
                onRequestRevision={(feedback) => console.log('Revision', feedback)}
                onAcceptDelivery={() => console.log('Accept delivery')}
                onCompletePayment={() => console.log('Complete payment')}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-sm mb-1">悬赏金额</p>
              <p className="text-4xl font-bold text-red-500 mb-4">
                ¥{mockBounty.amount.toLocaleString()}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">截止日期</span>
                  <span className={`font-medium ${daysLeft <= 3 ? 'text-red-500' : 'text-gray-700'}`}>
                    {mockBounty.deadline} ({daysLeft}天后)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">分类</span>
                  <span className="text-gray-700">{mockBounty.category}</span>
                </div>
              </div>

              {/* Action Button */}
              {mockBounty.status === 'open' && !isOwner && (
                hasApplied ? (
                  <button disabled className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed">
                    ✓ 已申请
                  </button>
                ) : isLoggedIn ? (
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:opacity-90"
                  >
                    立即申请接单
                  </button>
                ) : (
                  <Link href="/login" className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-center hover:opacity-90">
                    登录后申请
                  </Link>
                )
              )}
            </div>

            {/* Publisher Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">发布者</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={mockBounty.publisher.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-medium text-gray-800">{mockBounty.publisher.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>⭐ {mockBounty.publisher.rating}</span>
                    <span>•</span>
                    <span>{mockBounty.publisher.bountyCount}个悬赏</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                💬 联系发布者
              </button>
            </div>

            {/* Tips */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h4 className="font-medium text-orange-800 mb-2">💡 温馨提示</h4>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• 仔细阅读需求后再申请</li>
                <li>• 按时交付，保持沟通</li>
                <li>• 有问题及时联系发布者</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        bountyTitle={mockBounty.title}
        bountyAmount={mockBounty.amount}
        onClose={() => setShowApplyModal(false)}
        onSubmit={(data) => {
          console.log('Apply:', data);
          setShowApplyModal(false);
        }}
      />
    </div>
  );
}
