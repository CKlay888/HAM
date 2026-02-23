'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockAgents } from '@/lib/mock-data';

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const myAgents = mockAgents.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🚀 开发者中心</h1>
              <p className="text-white/80 mt-1">发布你的Agent，赚取收益</p>
            </div>
            <Link href="/publish" className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-50">
              + 发布新Agent
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '已发布', value: '3', icon: '📦' },
            { label: '总销量', value: '12.5k', icon: '🛒' },
            { label: '本月收入', value: '¥3,456', icon: '💰' },
            { label: '累计收入', value: '¥12,890', icon: '🏆' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {['overview', 'agents', 'income', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' ? '数据概览' : 
                 tab === 'agents' ? '我的Agent' :
                 tab === 'income' ? '收入明细' : '设置'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'agents' && (
              <div className="space-y-4">
                {myAgents.map(agent => (
                  <div key={agent.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                    <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{agent.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>⭐ {agent.rating}</span>
                        <span>🛒 {agent.callCount}销量</span>
                        <span className="text-green-500">✓ 已上架</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">本月收入</p>
                      <p className="text-xl font-bold text-red-500">¥{(agent.callCount * 0.05).toFixed(0)}</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      管理
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="text-center py-8">
                <p className="text-gray-500">📊 数据图表开发中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
