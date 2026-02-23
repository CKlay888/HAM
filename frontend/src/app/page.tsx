'use client';

import { useState, useMemo } from 'react';
import AgentCard from '@/components/AgentCard';
import SearchFilter from '@/components/SearchFilter';
import { mockAgents } from '@/lib/mock-data';

export default function MarketPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedSort, setSelectedSort] = useState('popular');

  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];

    // Filter by keyword
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(lowerKeyword) ||
          agent.tagline.toLowerCase().includes(lowerKeyword) ||
          agent.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
      );
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      result = result.filter((agent) => agent.category === selectedCategory);
    }

    // Sort
    switch (selectedSort) {
      case 'popular':
        result.sort((a, b) => b.callCount - a.callCount);
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => {
          const priceA = a.priceType === 'free' ? 0 : parseFloat(a.priceDisplay.replace(/[^\d.]/g, ''));
          const priceB = b.priceType === 'free' ? 0 : parseFloat(b.priceDisplay.replace(/[^\d.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        result.sort((a, b) => {
          const priceA = a.priceType === 'free' ? 0 : parseFloat(a.priceDisplay.replace(/[^\d.]/g, ''));
          const priceB = b.priceType === 'free' ? 0 : parseFloat(b.priceDisplay.replace(/[^\d.]/g, ''));
          return priceB - priceA;
        });
        break;
    }

    return result;
  }, [keyword, selectedCategory, selectedSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          发现最适合你的{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Agent
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          中国首个 AI Agent 交易市场，数千款智能助手等你探索
        </p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">🎉 新用户专享</h2>
            <p className="text-blue-100">注册即送 ¥10 体验金，畅享所有 Agent 服务</p>
          </div>
          <button className="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            立即领取
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        onSearch={setKeyword}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          找到 <span className="font-semibold text-gray-900">{filteredAgents.length}</span> 个 Agent
        </p>
      </div>

      {/* Agent Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="relative">
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的 Agent</h3>
          <p className="text-gray-500">试试其他关键词或分类</p>
        </div>
      )}

      {/* Load More */}
      {filteredAgents.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            加载更多
          </button>
        </div>
      )}
    </div>
  );
}
