'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUser, mockSubscriptions, mockUsageRecords, mockAgents } from '@/lib/mock-data';

type TabType = 'overview' | 'orders' | 'agents' | 'published' | 'settings';

const menuItems = [
  { id: 'overview', label: '账户总览', icon: '🏠' },
  { id: 'orders', label: '我的订单', icon: '📦' },
  { id: 'agents', label: '我的Agent', icon: '🤖' },
  { id: 'published', label: '我发布的', icon: '📤' },
  { id: 'settings', label: '账户设置', icon: '⚙️' },
];

export default function UserCenterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const user = mockUser;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* User Header Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-20 h-20 rounded-full border-4 border-white/30"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <p className="text-white/80">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {user.role === 'developer' ? '🏅 认证开发者' : '👤 普通用户'}
                </span>
                <span className="text-sm text-white/80">注册于 2026年1月</span>
              </div>
            </div>
            {/* Balance */}
            <div className="text-right">
              <p className="text-white/80 text-sm">账户余额</p>
              <p className="text-3xl font-bold">¥{user.balance.toFixed(2)}</p>
              <button className="mt-2 px-4 py-1.5 bg-white text-orange-500 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors">
                充值
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '已购服务', value: mockSubscriptions.length, icon: '📦', color: 'text-orange-500' },
            { label: '本月消费', value: '¥42.50', icon: '💰', color: 'text-red-500' },
            { label: '累计调用', value: '1,234', icon: '📊', color: 'text-blue-500' },
            { label: '节省时间', value: '26小时', icon: '⏰', color: 'text-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content: Left Menu + Right Content */}
        <div className="flex gap-6">
          {/* Left Sidebar Menu */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">账户总览</h2>
                  
                  {/* Recent Orders */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">最近订单</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-orange-500 text-sm hover:underline">
                        查看全部 →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {mockSubscriptions.slice(0, 2).map((sub) => (
                        <div key={sub.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img src={sub.agentAvatar} alt={sub.agentName} className="w-12 h-12 rounded-lg" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{sub.agentName}</p>
                            <p className="text-sm text-gray-500">{sub.planName} · {sub.endDate}到期</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            sub.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {sub.status === 'active' ? '生效中' : '已过期'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Usage */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">最近使用</h3>
                    </div>
                    <div className="space-y-2">
                      {mockUsageRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${record.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-gray-800">{record.agentName}</span>
                          </div>
                          <span className="text-sm text-gray-500">{record.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">我的订单</h2>
                  <div className="space-y-4">
                    {mockSubscriptions.map((sub) => (
                      <div key={sub.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between text-sm">
                          <span className="text-gray-500">订单号: ORD{sub.id}2026</span>
                          <span className={sub.status === 'active' ? 'text-green-600' : 'text-gray-500'}>
                            {sub.status === 'active' ? '服务中' : '已结束'}
                          </span>
                        </div>
                        <div className="p-4 flex items-center gap-4">
                          <img src={sub.agentAvatar} alt={sub.agentName} className="w-16 h-16 rounded-xl" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{sub.agentName}</h3>
                            <p className="text-sm text-gray-500">{sub.planName}</p>
                            <p className="text-sm text-gray-500">{sub.startDate} 至 {sub.endDate}</p>
                          </div>
                          {sub.total && (
                            <div className="text-right">
                              <p className="text-sm text-gray-500">使用量</p>
                              <p className="font-bold text-orange-500">{sub.used}/{sub.total}</p>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <button className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600">
                              续费
                            </button>
                            <button className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-50">
                              详情
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Agents Tab */}
              {activeTab === 'agents' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">我购买的Agent</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {mockSubscriptions.map((sub) => (
                      <Link key={sub.id} href={`/agents/${sub.agentId}`}>
                        <div className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <img src={sub.agentAvatar} alt={sub.agentName} className="w-12 h-12 rounded-xl" />
                            <div>
                              <h3 className="font-medium text-gray-800">{sub.agentName}</h3>
                              <p className="text-sm text-gray-500">{sub.planName}</p>
                            </div>
                          </div>
                          {sub.total && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>本月用量</span>
                                <span>{sub.used}/{sub.total}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-500 h-2 rounded-full" 
                                  style={{ width: `${(sub.used / sub.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:opacity-90">
                            立即使用
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Tab */}
              {activeTab === 'published' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">我发布的Agent</h2>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
                      + 发布新Agent
                    </button>
                  </div>
                  
                  {user.role === 'developer' ? (
                    <div className="space-y-4">
                      {mockAgents.slice(0, 2).map((agent) => (
                        <div key={agent.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-xl" />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800">{agent.name}</h3>
                              <p className="text-sm text-gray-500">{agent.tagline}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="text-green-600">✓ 已上架</span>
                                <span className="text-gray-500">销量: {agent.callCount}</span>
                                <span className="text-gray-500">评分: {agent.rating}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">本月收入</p>
                              <p className="text-xl font-bold text-red-500">¥1,234</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🚀</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">成为开发者</h3>
                      <p className="text-gray-500 mb-4">发布你的Agent，赚取收益</p>
                      <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600">
                        申请成为开发者
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">账户设置</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                      <input
                        type="text"
                        defaultValue={user.username}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                      <input
                        type="text"
                        defaultValue={user.displayName}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                      保存修改
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
