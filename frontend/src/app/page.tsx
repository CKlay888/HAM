'use client';

import { useState, useMemo } from 'react';
import AgentCard from '@/components/AgentCard';
import Banner from '@/components/Banner';
import CategoryNav from '@/components/CategoryNav';
import HotSection from '@/components/HotSection';
import { mockAgents } from '@/lib/mock-data';

const categoryMap: Record<string, string> = {
  all: '全部',
  dev: '开发工具',
  content: '内容创作',
  data: '数据分析',
  design: '设计工具',
  lang: '语言工具',
  pro: '专业服务',
  edu: '教育学习',
  life: '效率工具',
  hot: '全部',
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('sales');

  // 筛选和排序
  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];

    // 关键词搜索
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(kw) || a.tagline.toLowerCase().includes(kw)
      );
    }

    // 分类筛选
    if (selectedCategory !== 'all' && selectedCategory !== 'hot') {
      const catName = categoryMap[selectedCategory];
      result = result.filter((a) => a.category === catName);
    }

    // 排序
    if (sortBy === 'sales') {
      result.sort((a, b) => b.callCount - a.callCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => {
        const pa = a.priceType === 'free' ? 0 : parseFloat(a.priceDisplay.replace(/[^\d.]/g, ''));
        const pb = b.priceType === 'free' ? 0 : parseFloat(b.priceDisplay.replace(/[^\d.]/g, ''));
        return pa - pb;
      });
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => {
        const pa = a.priceType === 'free' ? 0 : parseFloat(a.priceDisplay.replace(/[^\d.]/g, ''));
        const pb = b.priceType === 'free' ? 0 : parseFloat(b.priceDisplay.replace(/[^\d.]/g, ''));
        return pb - pa;
      });
    }

    return result;
  }, [keyword, selectedCategory, sortBy]);

  // 热门和特惠数据
  const hotAgents = mockAgents.filter((a) => a.isFeatured || a.rating >= 4.7);
  const saleAgents = mockAgents.filter((a) => a.priceType !== 'free');
  const newAgents = [...mockAgents].reverse();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Banner 轮播 */}
        <Banner />

        {/* 分类导航 */}
        <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* 热门推荐 */}
        <HotSection title="热门榜单" subtitle="大家都在用" agents={hotAgents} type="hot" />

        {/* 限时特惠 */}
        <HotSection title="限时特惠" subtitle="低至5折" agents={saleAgents} type="sale" />

        {/* 搜索和筛选栏 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* 搜索框 */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="搜索Agent..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* 排序选项 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">排序:</span>
              {[
                { id: 'sales', label: '销量' },
                { id: 'rating', label: '评分' },
                { id: 'price_asc', label: '价格↑' },
                { id: 'price_desc', label: '价格↓' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    sortBy === opt.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800">
              全部商品 <span className="text-orange-500 text-sm font-normal">({filteredAgents.length})</span>
            </h2>
          </div>

          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">没有找到相关商品</h3>
              <p className="text-gray-500">换个关键词试试吧</p>
            </div>
          )}

          {/* 加载更多 */}
          {filteredAgents.length > 0 && (
            <div className="text-center mt-6">
              <button className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                加载更多
              </button>
            </div>
          )}
        </div>

        {/* 新品上架 */}
        <HotSection title="新品上架" subtitle="最新发布" agents={newAgents} type="new" />
      </div>
    </div>
  );
}
