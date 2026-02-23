'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AgentCard from '@/components/AgentCard';
import SearchBar from '@/components/SearchBar';
import CategoryTabs from '@/components/CategoryTabs';
import Pagination from '@/components/Pagination';
import { mockAgents } from '@/lib/mock-data';

const categoryTabs = [
  { id: 'all', label: '全部', count: 128 },
  { id: 'dev', label: '开发工具', count: 45 },
  { id: 'content', label: '内容创作', count: 32 },
  { id: 'data', label: '数据分析', count: 28 },
  { id: 'design', label: '设计工具', count: 23 },
];

const sortOptions = [
  { id: 'default', label: '综合排序' },
  { id: 'sales', label: '销量优先' },
  { id: 'rating', label: '评分优先' },
  { id: 'price_asc', label: '价格从低到高' },
  { id: 'price_desc', label: '价格从高到低' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];
    
    if (query) {
      const kw = query.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(kw) || 
        a.tagline.toLowerCase().includes(kw)
      );
    }

    if (sortBy === 'sales') result.sort((a, b) => b.callCount - a.callCount);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    
    return result;
  }, [query, sortBy]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <SearchBar defaultValue={query} showHotSearch={true} />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-800">
            搜索结果: <span className="text-orange-500">"{query}"</span>
            <span className="text-sm font-normal text-gray-500 ml-2">
              共 {filteredAgents.length} 个结果
            </span>
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CategoryTabs tabs={categoryTabs} activeTab={category} onChange={setCategory} />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">排序:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredAgents.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">没有找到相关结果</h2>
            <p className="text-gray-500">换个关键词试试吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
