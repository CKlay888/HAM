'use client';

interface SalesCountProps {
  count: number;
  label?: string;
  size?: 'sm' | 'md';
}

export default function SalesCount({ count, label = '人付款', size = 'md' }: SalesCountProps) {
  const formatCount = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return (
    <div className={`flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500`}>
      <span className="text-orange-500 font-medium">{formatCount(count)}</span>
      <span>{label}</span>
    </div>
  );
}
