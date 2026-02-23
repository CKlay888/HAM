'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import BountyCard, { FeaturedBountyCard } from '@/components/BountyCard';
import { StatusFilter } from '@/components/BountyStatus';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';

// Mock Data
const mockBounties = [
  {
    id: '1',
    title: '开发一个React数据可视化组件库',
    description: '需要包含折线图、柱状图、饼图等常用图表，支持响应式和主题定制，使用TypeScript开发。',
    amount: 5000,
    category: '开发',
    status: 'open' as const,
    deadline: '2026-03-15',
    applicantCount: 12,
    createdAt: '2026-02-20',
    publisher: { name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang' },
    tags: ['React', 'TypeScript', 'D3.js'],
    urgent: true,
  },
  {
    id: '2',
    title: 'AI Agent交互界面UI设计',
    description: '为AI Agent市场设计一套完整的UI界面，包括首页、详情页、个人中心等页面。',
    amount: 3000,
    category: '设计',
    status: 'open' as const,
    deadline: '2026-03-10',
    applicantCount: 8,
    createdAt: '2026-02-21',
    publisher: { name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li' },
    tags: ['UI设计', 'Figma', 'AI'],
  },
  {
    id: '3',
    title: '爬取电商平台商品数据',
    description: '需要爬取某电商平台的商品信息，包括标题、价格、销量、评价等，导出为CSV格式。',
    amount: 800,
    category: '数据',
    status: 'in_progress' as const,
    deadline: '2026-03-05',
    applicantCount: 5,
    createdAt: '2026-02-22',
    publisher: { name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang' },
    tags: ['Python', '爬虫', '数据分析'],
  },
  {
    id: '4',
    title: '英文技术文档翻译',
    description: '翻译一份React框架的英文技术文档，约2万字，要求准确专业。',
    amount: 1500,
    category: '翻译',
    status: 'open' as const,
    deadline: '2026-03-20',
    applicantCount: 15,
    createdAt: '2026-02-19',
    publisher: { name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao' },
    tags: ['英译中', '技术文档', 'React'],
  },
  {
    id: '5',
    title: '公司宣传片文案策划',
    description: '为科技公司策划一支3分钟宣传片的文案脚本，要求突出AI技术优势。',
    amount: 2000,
    category: '文案',
    status: 'delivered' as const,
    deadline: '2026-03-01',
    applicantCount: 20,
    createdAt: '2026-02-15',
    publisher: { name: '钱七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qian' },
    tags: ['文案', '宣传片', 'AI'],
  },
  {
    id: '6',
    title: 'Python自动化脚本开发',
    description: '开发一个自动化报表生成脚本，从多个数据源汇总数据并生成Excel报告。',
    amount: 1200,
    category: '开发',
    status: 'completed' as const,
    deadline: '2026-02-25',
    applicantCount: 7,
    createdAt: '2026-02-10',
    publisher: { name: '孙八', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sun' },
    tags: ['Python', '自动化', 'Excel'],
  },
];

const categories = ['全部', '开发', '设计', '文案', '数据', '翻译', '其他'];
const amountRanges = [
  { label: '全部金额', min: 0, max: Infinity },
  { label: '500元以下', min: 0, max: 500 },
  { label: '500-2000元', min: 500, max: 2000 },
  { label: '2000-5000元', min: 2000, max: 5000 },
  { label: '5000元以上', min: 5000, max: Infinity },
];
const sortOptions = [
  { id: 'latest', label: '最新发布' },
  { id: 'amount_desc', label: '金额最高' },
  { id: 'deadline', label: '即将截止' },
  { id: 'applicants', label: '申请最多' },
];

export default function BountiesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [amountRange, setAmountRange] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBounties = useMemo(() => {
    let result = [...mockBounties];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== '全部') {
      result = result.filter(b => b.category === categoryFilter);
    }

    // Amount filter
    const range = amountRanges[amountRange];
    result = result.filter(b => b.amount >= range.min && b.amount < range.max);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'amount_desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'applicants':
        result.sort((a, b) => b.applicantCount - a.applicantCount);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [statusFilter, categoryFilter, amountRange, sortBy, searchQuery]);

  const featuredBounty = mockBounties.find(b => b.urgent && b.status === 'open');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">🎯 悬赏大厅</h1>
              <p className="text-white/80 mt-1">发布需求，悬赏求助，轻松找到合适的人</p>
            </div>
            <Link
              href="/bounties/new"
              className="px-6 py-3 bg-white text-orange-500 rounded-full font-bold hover:bg-orange-50 transition-colors"
            >
              + 发布悬赏
            </Link>
          </div>
          
          <SearchBar 
            defaultValue={searchQuery}
            onSearch={setSearchQuery}
            showHotSearch={false}
            placeholder="搜索悬赏任务..."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured */}
        {featuredBounty && (
          <div className="mb-6">
            <FeaturedBountyCard bounty={featuredBounty} />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 space-y-4">
          {/* Status */}
          <StatusFilter 
            selectedStatus={statusFilter as any} 
            onChange={setStatusFilter as any}
            counts={{ all: mockBounties.length, open: 4, in_progress: 1, delivered: 1 }}
          />

          {/* Category & Amount & Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">分类:</span>
              <div className="flex gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      categoryFilter === cat
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">金额:</span>
              <select
                value={amountRange}
                onChange={e => setAmountRange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                {amountRanges.map((range, i) => (
                  <option key={i} value={i}>{range.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-500 text-sm">排序:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            共 <span className="font-bold text-orange-500">{filteredBounties.length}</span> 个悬赏
          </p>
        </div>

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
            <h2 className="text-xl font-bold text-gray-800 mb-2">没有找到相关悬赏</h2>
            <p className="text-gray-500 mb-4">试试调整筛选条件</p>
            <Link href="/bounties/new" className="text-orange-500 hover:underline">
              或者发布一个新悬赏 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
