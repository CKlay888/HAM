'use client';

interface UsageData {
  label: string;
  used: number;
  total: number;
  unit: string;
}

interface UsageStatsProps {
  planName: string;
  expireDate: string;
  usages: UsageData[];
}

const defaultUsages: UsageData[] = [
  { label: 'API 调用次数', used: 1250, total: 5000, unit: '次' },
  { label: '存储空间', used: 2.5, total: 10, unit: 'GB' },
  { label: '并发请求', used: 8, total: 20, unit: '个' },
];

export default function UsageStats({ 
  planName = '专业版', 
  expireDate = '2026-03-23',
  usages = defaultUsages 
}: Partial<UsageStatsProps>) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">当前套餐</p>
            <h3 className="text-2xl font-bold">{planName}</h3>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">到期时间</p>
            <p className="font-medium">{expireDate}</p>
          </div>
        </div>
      </div>

      {/* Usage Bars */}
      <div className="p-6 space-y-6">
        {usages.map((usage, index) => {
          const percentage = (usage.used / usage.total) * 100;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">{usage.label}</span>
                <span className="text-gray-500 text-sm">
                  <span className={percentage >= 90 ? 'text-red-500 font-bold' : ''}>
                    {usage.used}
                  </span>
                  <span className="text-gray-400"> / {usage.total} {usage.unit}</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${getProgressColor(percentage)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              {percentage >= 80 && (
                <p className="text-orange-500 text-xs mt-1">
                  ⚠️ 使用量即将达到上限，建议升级套餐
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-3">
        <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90">
          升级套餐
        </button>
        <button className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50">
          查看详情
        </button>
      </div>
    </div>
  );
}
