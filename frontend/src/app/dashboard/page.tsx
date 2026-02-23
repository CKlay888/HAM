'use client';

import { useState } from 'react';
import RevenueChart from '@/components/RevenueChart';
import OrdersTable from '@/components/OrdersTable';
import AgentStats from '@/components/AgentStats';

export default function DashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const stats = [
    { label: '今日收入', value: '¥678', icon: '💰', trend: '+12.5%', trendUp: true },
    { label: '今日订单', value: '38', icon: '📦', trend: '+8.3%', trendUp: true },
    { label: '本月收入', value: '¥12,456', icon: '🏆', trend: '+23.1%', trendUp: true },
    { label: '待处理', value: '5', icon: '⏳', trend: '-2', trendUp: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📊 数据概览</h1>
          <p className="text-gray-500">欢迎回来！查看你的Agent运营数据</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-500 text-sm">时间范围:</span>
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm ${
                period === p
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === '7d' ? '近7天' : p === '30d' ? '近30天' : '近90天'}
            </button>
          ))}
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart period={period} data={[]} />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">⚡ 快捷操作</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📤', label: '发布Agent', href: '/publish', color: 'from-orange-500 to-red-500' },
                { icon: '💰', label: '提现', href: '#', color: 'from-green-500 to-emerald-500' },
                { icon: '📊', label: '数据分析', href: '#', color: 'from-blue-500 to-cyan-500' },
                { icon: '⚙️', label: '设置', href: '/user', color: 'from-purple-500 to-pink-500' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl mb-2 block">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Stats */}
        <div className="mb-6">
          <AgentStats />
        </div>

        {/* Orders Table */}
        <OrdersTable title="最新订单" />

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">💡 运营小贴士</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>• 保持Agent稳定在线，提高可靠性评分</li>
            <li>• 及时回复用户评价，提升口碑</li>
            <li>• 定期更新功能描述，吸引更多用户</li>
            <li>• 合理定价，参考同类Agent定价策略</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
