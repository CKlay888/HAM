'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUser, mockSubscriptions, mockUsageRecords } from '@/lib/mock-data';

type TabType = 'subscriptions' | 'usage' | 'settings';

export default function UserCenterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const user = mockUser;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-20 h-20 rounded-full border-4 border-gray-100"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                {user.role === 'developer' ? '开发者' : '普通用户'}
              </span>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-blue-100 text-sm mb-1">账户余额</p>
            <p className="text-3xl font-bold">¥{user.balance.toFixed(2)}</p>
            <button className="mt-2 px-4 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              充值
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">已订阅服务</p>
          <p className="text-2xl font-bold text-gray-900">{mockSubscriptions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">本月调用</p>
          <p className="text-2xl font-bold text-gray-900">579</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">本月消费</p>
          <p className="text-2xl font-bold text-gray-900">¥42.50</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm mb-1">节省时间</p>
          <p className="text-2xl font-bold text-gray-900">26h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'subscriptions', label: '我的订阅', icon: '📦' },
              { id: 'usage', label: '使用记录', icon: '📊' },
              { id: 'settings', label: '账户设置', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              {mockSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={sub.agentAvatar}
                      alt={sub.agentName}
                      className="w-12 h-12 rounded-xl bg-gray-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Link href={`/agent/${sub.agentId}`} className="font-semibold text-gray-900 hover:text-blue-600">
                            {sub.agentName}
                          </Link>
                          <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                            {sub.planName}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            sub.status === 'active'
                              ? 'bg-green-50 text-green-600'
                              : sub.status === 'expired'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {sub.status === 'active' ? '生效中' : sub.status === 'expired' ? '已过期' : '已取消'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>有效期: {sub.startDate} ~ {sub.endDate}</span>
                        {sub.total && (
                          <span>
                            已用: {sub.used}/{sub.total} 次
                          </span>
                        )}
                      </div>

                      {/* Usage Progress */}
                      {sub.total && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>使用量</span>
                            <span>{Math.round((sub.used / sub.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(sub.used / sub.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button className="px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      续费
                    </button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      管理
                    </button>
                  </div>
                </div>
              ))}

              {mockSubscriptions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-gray-500">暂无订阅服务</p>
                  <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                    去市场逛逛 →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Usage Tab */}
          {activeTab === 'usage' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                      <th className="pb-3 font-medium">Agent</th>
                      <th className="pb-3 font-medium">时间</th>
                      <th className="pb-3 font-medium">状态</th>
                      <th className="pb-3 font-medium">响应时间</th>
                      <th className="pb-3 font-medium text-right">消耗</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockUsageRecords.map((record) => (
                      <tr key={record.id} className="text-sm">
                        <td className="py-3">
                          <Link href={`/agent/${record.agentId}`} className="font-medium text-gray-900 hover:text-blue-600">
                            {record.agentName}
                          </Link>
                        </td>
                        <td className="py-3 text-gray-500">{record.timestamp}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              record.status === 'success'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {record.status === 'success' ? '成功' : '失败'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{record.responseTime}s</td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          {record.cost > 0 ? `¥${record.cost.toFixed(2)}` : '免费'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-blue-600 text-sm hover:underline">
                  查看更多记录
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">个人信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">显示名称</label>
                    <input
                      type="text"
                      defaultValue={user.displayName}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">邮件通知</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">服务到期提醒</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">余额不足提醒</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-600" />
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6">
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  保存设置
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
