'use client';

import { useState } from 'react';
import Link from 'next/link';
import CategoryTabs from '@/components/CategoryTabs';
import { mockSubscriptions } from '@/lib/mock-data';

const orderTabs = [
  { id: 'all', label: '全部订单' },
  { id: 'active', label: '进行中' },
  { id: 'expired', label: '已结束' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = mockSubscriptions.filter(sub => {
    if (activeTab === 'active') return sub.status === 'active';
    if (activeTab === 'expired') return sub.status !== 'active';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">📦 我的订单</h1>
          <CategoryTabs tabs={orderTabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">订单号: ORD{order.id}2026</span>
                  <span className="text-gray-500">{order.startDate}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'active' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {order.status === 'active' ? '服务中' : '已结束'}
                </span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <img src={order.agentAvatar} alt={order.agentName} className="w-20 h-20 rounded-xl" />
                  <div className="flex-1">
                    <Link href={`/agents/${order.agentId}`} className="font-bold text-gray-800 hover:text-orange-500">
                      {order.agentName}
                    </Link>
                    <p className="text-gray-500 text-sm">{order.planName}</p>
                    <p className="text-gray-500 text-sm">有效期: {order.startDate} 至 {order.endDate}</p>
                    {order.total && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">使用量:</span>
                          <span className="text-orange-500 font-bold">{order.used}</span>
                          <span className="text-gray-400">/ {order.total}</span>
                        </div>
                        <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: `${(order.used/order.total)*100}%`}} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium hover:opacity-90">
                      续费
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-50">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
