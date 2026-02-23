'use client';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: DataPoint[];
  period?: '7d' | '30d' | '90d';
}

const mockData: DataPoint[] = [
  { date: '02/17', revenue: 234, orders: 12 },
  { date: '02/18', revenue: 456, orders: 23 },
  { date: '02/19', revenue: 321, orders: 18 },
  { date: '02/20', revenue: 567, orders: 31 },
  { date: '02/21', revenue: 432, orders: 25 },
  { date: '02/22', revenue: 678, orders: 38 },
  { date: '02/23', revenue: 543, orders: 29 },
];

export default function RevenueChart({ data = mockData, period = '7d' }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">📈 收入趋势</h3>
          <p className="text-sm text-gray-500">近{period === '7d' ? '7天' : period === '30d' ? '30天' : '90天'}数据</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">总收入</p>
            <p className="text-xl font-bold text-red-500">¥{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">总订单</p>
            <p className="text-xl font-bold text-orange-500">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">¥{item.revenue}</span>
              <div
                className="w-full bg-gradient-to-t from-orange-500 to-red-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-red-500"
                style={{ height: `${(item.revenue / maxRevenue) * 150}px` }}
              />
            </div>
            <span className="text-xs text-gray-400 mt-2">{item.date}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-400 rounded" />
          <span className="text-sm text-gray-500">收入</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-sm text-gray-500">订单数</span>
        </div>
      </div>
    </div>
  );
}
