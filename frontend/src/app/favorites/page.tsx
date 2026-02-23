'use client';

import { useState } from 'react';
import AgentCard from '@/components/AgentCard';
import Pagination from '@/components/Pagination';
import { mockAgents } from '@/lib/mock-data';

export default function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const favorites = mockAgents.slice(0, 4); // Mock favorites

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h1 className="text-xl font-bold text-gray-800">❤️ 我的收藏</h1>
          <p className="text-gray-500 text-sm mt-1">共 {favorites.length} 个收藏</p>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {favorites.map(agent => (
                <div key={agent.id} className="relative">
                  <AgentCard agent={agent} />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50">
                    ❤️
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-5xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">还没有收藏</h2>
            <p className="text-gray-500">去市场逛逛，收藏喜欢的Agent吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
