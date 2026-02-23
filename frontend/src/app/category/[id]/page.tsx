'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import AgentCard from '@/components/AgentCard';
import Pagination from '@/components/Pagination';
import { mockAgents } from '@/lib/mock-data';

const categories: Record<string, { name: string; icon: string; desc: string }> = {
  dev: { name: '开发工具', icon: '💻', desc: '代码生成、调试、测试等编程助手' },
  content: { name: '内容创作', icon: '✍️', desc: '文案、文章、脚本等内容生成' },
  data: { name: '数据分析', icon: '📊', desc: '数据处理、可视化、报告生成' },
  design: { name: '设计工具', icon: '🎨', desc: 'UI设计、配色、原型建议' },
  lang: { name: '语言翻译', icon: '🌍', desc: '多语言翻译、本地化' },
  pro: { name: '专业服务', icon: '💼', desc: '法律、财务、咨询等专业领域' },
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const category = categories[categoryId] || { name: '全部', icon: '🏠', desc: '' };
  
  const [sortBy, setSortBy] = useState('sales');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];
    if (sortBy === 'sales') result.sort((a, b) => b.callCount - a.callCount);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-white/80">{category.desc}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">共 {filteredAgents.length} 个Agent</span>
            </div>
            <div className="flex items-center gap-2">
              {['sales', 'rating', 'price'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    sortBy === sort
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sort === 'sales' ? '销量' : sort === 'rating' ? '评分' : '价格'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
