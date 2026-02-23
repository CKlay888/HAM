'use client';

import Link from 'next/link';

interface Order {
  id: string;
  agentName: string;
  buyerName: string;
  buyerAvatar: string;
  planName: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  createdAt: string;
}

const mockOrders: Order[] = [
  { id: 'ORD001', agentName: 'CodeMaster Pro', buyerName: '张三', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang', planName: '专业版', amount: 29, status: 'completed', createdAt: '2026-02-23 14:30' },
  { id: 'ORD002', agentName: 'CodeMaster Pro', buyerName: '李四', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li', planName: '按次计费', amount: 2.5, status: 'completed', createdAt: '2026-02-23 13:15' },
  { id: 'ORD003', agentName: '文案大师', buyerName: '王五', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang', planName: '无限版', amount: 99, status: 'pending', createdAt: '2026-02-23 12:00' },
  { id: 'ORD004', agentName: 'DataInsight', buyerName: '赵六', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao', planName: '专业版', amount: 29, status: 'refunded', createdAt: '2026-02-22 18:45' },
  { id: 'ORD005', agentName: 'CodeMaster Pro', buyerName: '钱七', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qian', planName: '按次计费', amount: 5, status: 'completed', createdAt: '2026-02-22 16:30' },
];

interface OrdersTableProps {
  orders?: Order[];
  showAgent?: boolean;
  title?: string;
}

export default function OrdersTable({ orders = mockOrders, showAgent = true, title = '最新订单' }: OrdersTableProps) {
  const statusConfig = {
    completed: { label: '已完成', color: 'bg-green-100 text-green-600' },
    pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-600' },
    refunded: { label: '已退款', color: 'bg-red-100 text-red-600' },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">📋 {title}</h3>
        <Link href="/developer" className="text-orange-500 text-sm hover:underline">
          查看全部 →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              {showAgent && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">买家</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                {showAgent && <td className="px-6 py-4 text-sm text-gray-700">{order.agentName}</td>}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img src={order.buyerAvatar} alt={order.buyerName} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-700">{order.buyerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.planName}</td>
                <td className="px-6 py-4 text-sm font-bold text-red-500">¥{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
