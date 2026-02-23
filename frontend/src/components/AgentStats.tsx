'use client';

import Link from 'next/link';

interface AgentStat {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'review';
  sales: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  trend: number; // 增长率 %
}

const mockStats: AgentStat[] = [
  { id: '1', name: 'CodeMaster Pro', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=codemaster', status: 'online', sales: 1256, revenue: 3456, rating: 4.8, reviewCount: 234, trend: 12.5 },
  { id: '2', name: '文案大师', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=copywriter', status: 'online', sales: 892, revenue: 2345, rating: 4.6, reviewCount: 156, trend: -3.2 },
  { id: '3', name: 'DataInsight', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=datainsight', status: 'review', sales: 567, revenue: 1234, rating: 4.5, reviewCount: 89, trend: 8.7 },
];

interface AgentStatsProps {
  stats?: AgentStat[];
}

export default function AgentStats({ stats = mockStats }: AgentStatsProps) {
  const statusConfig = {
    online: { label: '已上架', color: 'bg-green-500', textColor: 'text-green-600' },
    offline: { label: '已下架', color: 'bg-gray-400', textColor: 'text-gray-600' },
    review: { label: '审核中', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">🤖 我的Agent</h3>
        <Link href="/publish" className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full hover:opacity-90">
          + 发布新Agent
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {stats.map((agent) => (
          <div key={agent.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Avatar & Status */}
              <div className="relative">
                <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-xl" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig[agent.status].color} rounded-full border-2 border-white`} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800">{agent.name}</h4>
                  <span className={`text-xs ${statusConfig[agent.status].textColor}`}>
                    {statusConfig[agent.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>⭐ {agent.rating} ({agent.reviewCount}评价)</span>
                  <span>🛒 {agent.sales}销量</span>
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className="text-sm text-gray-500">本月收入</p>
                <p className="text-xl font-bold text-red-500">¥{agent.revenue.toLocaleString()}</p>
                <p className={`text-xs ${agent.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {agent.trend >= 0 ? '↑' : '↓'} {Math.abs(agent.trend)}%
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link 
                  href={`/agents/${agent.id}`}
                  className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 text-center"
                >
                  查看
                </Link>
                <button className="px-4 py-1.5 border border-orange-300 text-orange-500 rounded-lg text-sm hover:bg-orange-50">
                  编辑
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{agent.sales}</p>
                <p className="text-xs text-gray-500">总销量</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">¥{agent.revenue}</p>
                <p className="text-xs text-gray-500">本月收入</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{agent.rating}</p>
                <p className="text-xs text-gray-500">评分</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{agent.reviewCount}</p>
                <p className="text-xs text-gray-500">评价</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
