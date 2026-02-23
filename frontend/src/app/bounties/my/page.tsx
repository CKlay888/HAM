'use client';

import { useState } from 'react';
import Link from 'next/link';
import BountyCard from '@/components/BountyCard';
import { StatusFilter } from '@/components/BountyStatus';
import Tabs from '@/components/Tabs';

// Mock Data
const myPublishedBounties = [
  {
    id: '1',
    title: '开发一个React数据可视化组件库',
    description: '需要包含折线图、柱状图、饼图等常用图表，支持响应式和主题定制。',
    amount: 5000,
    category: '开发',
    status: 'in_progress' as const,
    deadline: '2026-03-15',
    applicantCount: 12,
    createdAt: '2026-02-20',
    publisher: { name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
    tags: ['React', 'TypeScript'],
  },
  {
    id: '2',
    title: 'Logo设计 - 科技公司',
    description: '需要设计一个简洁现代的科技公司Logo。',
    amount: 800,
    category: '设计',
    status: 'open' as const,
    deadline: '2026-03-10',
    applicantCount: 5,
    createdAt: '2026-02-22',
    publisher: { name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
    tags: ['Logo', '设计'],
  },
];

const myAcceptedBounties = [
  {
    id: '3',
    title: '英文技术文档翻译',
    description: '翻译一份React框架的英文技术文档，约2万字。',
    amount: 1500,
    category: '翻译',
    status: 'in_progress' as const,
    deadline: '2026-03-20',
    applicantCount: 15,
    createdAt: '2026-02-19',
    publisher: { name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao' },
    tags: ['英译中', 'React'],
  },
  {
    id: '4',
    title: 'Python爬虫脚本开发',
    description: '开发一个数据爬虫脚本，抓取指定网站信息。',
    amount: 600,
    category: '开发',
    status: 'delivered' as const,
    deadline: '2026-02-28',
    applicantCount: 8,
    createdAt: '2026-02-15',
    publisher: { name: '孙八', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sun' },
    tags: ['Python', '爬虫'],
  },
];

const tabs = [
  { id: 'published', label: '我发布的', icon: '📤' },
  { id: 'accepted', label: '我接的单', icon: '📥' },
];

export default function MyBountiesPage() {
  const [activeTab, setActiveTab] = useState('published');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const bounties = activeTab === 'published' ? myPublishedBounties : myAcceptedBounties;
  
  const filteredBounties = statusFilter === 'all' 
    ? bounties 
    : bounties.filter(b => b.status === statusFilter);

  // Stats
  const publishedStats = {
    total: myPublishedBounties.length,
    open: myPublishedBounties.filter(b => b.status === 'open').length,
    inProgress: myPublishedBounties.filter(b => b.status === 'in_progress').length,
    totalAmount: myPublishedBounties.reduce((sum, b) => sum + b.amount, 0),
  };

  const acceptedStats = {
    total: myAcceptedBounties.length,
    inProgress: myAcceptedBounties.filter(b => b.status === 'in_progress').length,
    delivered: myAcceptedBounties.filter(b => b.status === 'delivered').length,
    totalEarned: myAcceptedBounties.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">📋 我的悬赏</h1>
              <p className="text-white/80 mt-1">管理你发布和接受的悬赏任务</p>
            </div>
            <Link
              href="/bounties/new"
              className="px-6 py-3 bg-white text-orange-500 rounded-full font-bold hover:bg-orange-50"
            >
              + 发布悬赏
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeTab === 'published' ? (
              <>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">发布总数</p>
                  <p className="text-2xl font-bold">{publishedStats.total}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">招募中</p>
                  <p className="text-2xl font-bold">{publishedStats.open}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">进行中</p>
                  <p className="text-2xl font-bold">{publishedStats.inProgress}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">总支出</p>
                  <p className="text-2xl font-bold">¥{publishedStats.totalAmount.toLocaleString()}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">接单总数</p>
                  <p className="text-2xl font-bold">{acceptedStats.total}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">进行中</p>
                  <p className="text-2xl font-bold">{acceptedStats.inProgress}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">待验收</p>
                  <p className="text-2xl font-bold">{acceptedStats.delivered}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/60 text-sm">已赚取</p>
                  <p className="text-2xl font-bold">¥{acceptedStats.totalEarned.toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab}
            variant="underline"
            fullWidth
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <StatusFilter 
            selectedStatus={statusFilter as any} 
            onChange={setStatusFilter as any}
          />
        </div>

        {/* Bounty List */}
        {filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBounties.map(bounty => (
              <div key={bounty.id} className="relative">
                <BountyCard bounty={bounty} />
                {/* Quick Actions */}
                {activeTab === 'published' && bounty.status === 'open' && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50" title="编辑">
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-5xl mb-4">{activeTab === 'published' ? '📤' : '📥'}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {activeTab === 'published' ? '还没有发布悬赏' : '还没有接单'}
            </h2>
            <p className="text-gray-500 mb-4">
              {activeTab === 'published' 
                ? '发布你的第一个悬赏，让专业的人帮你解决问题' 
                : '去悬赏大厅看看有什么适合你的任务吧'}
            </p>
            <Link 
              href={activeTab === 'published' ? '/bounties/new' : '/bounties'}
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:opacity-90"
            >
              {activeTab === 'published' ? '发布悬赏' : '浏览悬赏'}
            </Link>
          </div>
        )}

        {/* Help */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">💡 使用指南</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {activeTab === 'published' ? (
              <>
                <div className="flex gap-3">
                  <span className="text-orange-500">1.</span>
                  <p className="text-gray-600">发布悬赏后，等待申请者提交申请</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">2.</span>
                  <p className="text-gray-600">查看申请者资料，选择合适的人接单</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">3.</span>
                  <p className="text-gray-600">接单者交付后，验收并确认支付</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">4.</span>
                  <p className="text-gray-600">如有问题可申请平台介入仲裁</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <span className="text-orange-500">1.</span>
                  <p className="text-gray-600">申请接单后，等待发布者确认</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">2.</span>
                  <p className="text-gray-600">确认后开始工作，按时交付</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">3.</span>
                  <p className="text-gray-600">交付后等待发布者验收</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-orange-500">4.</span>
                  <p className="text-gray-600">验收通过后，款项自动到账</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
