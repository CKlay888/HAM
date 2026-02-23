'use client';

import { useState } from 'react';
import Link from 'next/link';
import BountyCard from '@/components/BountyCard';
import { StatusFilter } from '@/components/BountyStatus';

type BountyStatus = 'open' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'expired';

const mockPublishedBounties = [
  {
    id: '1',
    title: '急需开发一个电商小程序',
    description: '需要开发一个完整的微信小程序...',
    amount: 5000,
    category: '开发',
    status: 'in_progress' as BountyStatus,
    deadline: '2026-02-28',
    applicantCount: 12,
    createdAt: '2026-02-20',
    publisher: { name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
    urgent: true,
  },
  {
    id: '2',
    title: '企业官网设计',
    description: '为科技公司设计官网...',
    amount: 3000,
    category: '设计',
    status: 'open' as BountyStatus,
    deadline: '2026-03-05',
    applicantCount: 8,
    createdAt: '2026-02-21',
    publisher: { name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
  },
];

const mockTakenBounties = [
  {
    id: '3',
    title: '技术博客文章撰写',
    description: '需要撰写5篇关于AI的技术博客...',
    amount: 1500,
    category: '文案',
    status: 'in_progress' as BountyStatus,
    deadline: '2026-03-10',
    applicantCount: 15,
    createdAt: '2026-02-18',
    publisher: { name: '内容团队', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=content' },
  },
  {
    id: '4',
    title: '数据分析报告',
    description: '分析电商销售数据...',
    amount: 2000,
    category: '数据',
    status: 'delivered' as BountyStatus,
    deadline: '2026-03-01',
    applicantCount: 6,
    createdAt: '2026-02-22',
    publisher: { name: '数据部', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data' },
  },
  {
    id: '5',
    title: '产品说明书翻译',
    description: '50页技术产品说明书翻译...',
    amount: 800,
    category: '翻译',
    status: 'completed' as BountyStatus,
    deadline: '2026-02-25',
    applicantCount: 20,
    createdAt: '2026-02-15',
    publisher: { name: '产品组', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=product' },
  },
];

export default function MyBountiesPage() {
  const [activeTab, setActiveTab] = useState<'published' | 'taken'>('published');
  const [statusFilter, setStatusFilter] = useState<BountyStatus | 'all'>('all');

  const bounties = activeTab === 'published' ? mockPublishedBounties : mockTakenBounties;
  
  const filteredBounties = statusFilter === 'all' 
    ? bounties 
    : bounties.filter(b => b.status === statusFilter);

  // Stats
  const publishedStats = {
    total: mockPublishedBounties.length,
    open: mockPublishedBounties.filter(b => b.status === 'open').length,
    inProgress: mockPublishedBounties.filter(b => b.status === 'in_progress').length,
    totalAmount: mockPublishedBounties.reduce((sum, b) => sum + b.amount, 0),
  };

  const takenStats = {
    total: mockTakenBounties.length,
    inProgress: mockTakenBounties.filter(b => b.status === 'in_progress').length,
    completed: mockTakenBounties.filter(b => b.status === 'completed').length,
    totalEarned: mockTakenBounties.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 我的悬赏</h1>
            <p className="text-gray-500">管理你发布和接的悬赏任务</p>
          </div>
          <Link
            href="/bounties/new"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:opacity-90"
          >
            💰 发布悬赏
          </Link>
        </div>

        {/* Tab Switch */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex">
            <button
              onClick={() => { setActiveTab('published'); setStatusFilter('all'); }}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'published'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📤 我发布的 ({publishedStats.total})
            </button>
            <button
              onClick={() => { setActiveTab('taken'); setStatusFilter('all'); }}
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'taken'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📥 我接的单 ({takenStats.total})
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {activeTab === 'published' ? (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">总发布</p>
                <p className="text-2xl font-bold text-gray-800">{publishedStats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">招募中</p>
                <p className="text-2xl font-bold text-green-500">{publishedStats.open}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">进行中</p>
                <p className="text-2xl font-bold text-blue-500">{publishedStats.inProgress}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">总金额</p>
                <p className="text-2xl font-bold text-red-500">¥{publishedStats.totalAmount.toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">总接单</p>
                <p className="text-2xl font-bold text-gray-800">{takenStats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">进行中</p>
                <p className="text-2xl font-bold text-blue-500">{takenStats.inProgress}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">已完成</p>
                <p className="text-2xl font-bold text-green-500">{takenStats.completed}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-gray-500 text-sm">总收入</p>
                <p className="text-2xl font-bold text-red-500">¥{takenStats.totalEarned.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <StatusFilter 
            selectedStatus={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {/* Bounty List */}
        {filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBounties.map(bounty => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-5xl mb-4">
              {activeTab === 'published' ? '📤' : '📥'}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {activeTab === 'published' ? '还没有发布悬赏' : '还没有接单'}
            </h2>
            <p className="text-gray-500 mb-4">
              {activeTab === 'published' 
                ? '发布你的第一个悬赏，找人帮你完成任务' 
                : '去悬赏大厅看看有什么有趣的任务'
              }
            </p>
            <Link
              href={activeTab === 'published' ? '/bounties/new' : '/bounties'}
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:opacity-90"
            >
              {activeTab === 'published' ? '发布悬赏' : '浏览悬赏'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
