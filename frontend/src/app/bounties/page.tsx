'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import BountyCard, { FeaturedBountyCard } from '@/components/BountyCard';
import { StatusFilter } from '@/components/BountyStatus';
import Pagination from '@/components/Pagination';

type BountyStatus = 'open' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'expired';

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: BountyStatus;
  deadline: string;
  applicantCount: number;
  createdAt: string;
  publisher: { name: string; avatar: string };
  tags?: string[];
  urgent?: boolean;
}

const mockBounties: Bounty[] = [
  {
    id: '1',
    title: '急需开发一个电商小程序，功能完整，UI精美',
    description: '需要开发一个完整的微信小程序，包含商品展示、购物车、订单管理、支付等功能。要求有电商开发经验，代码规范。',
    amount: 5000,
    category: '开发',
    status: 'open',
    deadline: '2026-02-28',
    applicantCount: 12,
    createdAt: '2026-02-20',
    publisher: { name: '张老板', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boss1' },
    tags: ['小程序', '电商', 'React'],
    urgent: true,
  },
  {
    id: '2',
    title: '企业官网UI设计，现代简约风格',
    description: '为科技公司设计官网，需要首页、关于我们、产品介绍、联系我们等页面。风格要求现代、专业、简约。',
    amount: 3000,
    category: '设计',
    status: 'open',
    deadline: '2026-03-05',
    applicantCount: 8,
    createdAt: '2026-02-21',
    publisher: { name: '李经理', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager' },
    tags: ['UI设计', '官网', 'Figma'],
  },
  {
    id: '3',
    title: '技术博客文章撰写，AI领域',
    description: '需要撰写5篇关于人工智能的技术博客，每篇2000字以上，要求专业、易懂、有深度。',
    amount: 1500,
    category: '文案',
    status: 'in_progress',
    deadline: '2026-03-10',
    applicantCount: 15,
    createdAt: '2026-02-18',
    publisher: { name: '内容团队', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=content' },
    tags: ['AI', '技术写作', '博客'],
  },
  {
    id: '4',
    title: '数据分析报告，电商销售数据',
    description: '分析过去一年的电商销售数据，生成可视化报告，找出增长点和优化建议。',
    amount: 2000,
    category: '数据',
    status: 'open',
    deadline: '2026-03-01',
    applicantCount: 6,
    createdAt: '2026-02-22',
    publisher: { name: '数据部', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data' },
    tags: ['数据分析', 'Python', '可视化'],
  },
  {
    id: '5',
    title: '英文产品说明书翻译成中文',
    description: '50页技术产品说明书，需要专业翻译，保持术语准确性。',
    amount: 800,
    category: '翻译',
    status: 'delivered',
    deadline: '2026-02-25',
    applicantCount: 20,
    createdAt: '2026-02-15',
    publisher: { name: '产品组', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=product' },
    tags: ['英译中', '技术文档'],
  },
  {
    id: '6',
    title: 'App原型设计，社交类应用',
    description: '设计一款社交App的高保真原型，包含登录、动态、聊天、个人中心等模块。',
    amount: 4000,
    category: '设计',
    status: 'open',
    deadline: '2026-03-08',
    applicantCount: 9,
    createdAt: '2026-02-23',
    publisher: { name: '创业团队', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=startup' },
    tags: ['App设计', '社交', '原型'],
    urgent: true,
  },
];

const categories = [
  { id: 'all', label: '全部', icon: '🏠' },
  { id: '开发', label: '开发', icon: '💻' },
  { id: '设计', label: '设计', icon: '🎨' },
  { id: '文案', label: '文案', icon: '✍️' },
  { id: '数据', label: '数据', icon: '📊' },
  { id: '翻译', label: '翻译', icon: '🌍' },
];

const sortOptions = [
  { id: 'latest', label: '最新发布' },
  { id: 'amount_desc', label: '金额最高' },
  { id: 'deadline', label: '即将截止' },
  { id: 'hot', label: '最多申请' },
];

export default function BountiesPage() {
  const [statusFilter, setStatusFilter] = useState<BountyStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 99999]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBounties = useMemo(() => {
    let result = [...mockBounties];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(b => b.category === categoryFilter);
    }

    // Amount filter
    result = result.filter(b => b.amount >= amountRange[0] && b.amount <= amountRange[1]);

    // Sort
    switch (sortBy) {
      case 'amount_desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'hot':
        result.sort((a, b) => b.applicantCount - a.applicantCount);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [statusFilter, categoryFilter, sortBy, amountRange]);

  const featuredBounty = mockBounties.find(b => b.urgent && b.status === 'open');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🎯 悬赏大厅</h1>
            <p className="text-gray-500">发现有价值的任务，展示你的技能</p>
          </div>
          <Link
            href="/bounties/new"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:opacity-90 flex items-center gap-2"
          >
            <span>💰</span> 发布悬赏
          </Link>
        </div>

        {/* Featured */}
        {featuredBounty && (
          <div className="mb-6">
            <FeaturedBountyCard bounty={featuredBounty} />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 space-y-4">
          {/* Status Filter */}
          <StatusFilter 
            selectedStatus={statusFilter} 
            onChange={setStatusFilter}
            counts={{
              all: mockBounties.length,
              open: mockBounties.filter(b => b.status === 'open').length,
              in_progress: mockBounties.filter(b => b.status === 'in_progress').length,
              delivered: mockBounties.filter(b => b.status === 'delivered').length,
              completed: mockBounties.filter(b => b.status === 'completed').length,
            }}
          />

          {/* Category & Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bounty List */}
        {filteredBounties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {filteredBounties.map(bounty => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">暂无匹配的悬赏</h2>
            <p className="text-gray-500">调整筛选条件试试</p>
          </div>
        )}
      </div>
    </div>
  );
}
