'use client';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  showFree?: boolean;
}

export default function PriceTag({ price, originalPrice, unit = '次', size = 'md', showFree = true }: PriceTagProps) {
  const sizeClasses = {
    sm: { price: 'text-lg', symbol: 'text-xs', original: 'text-xs' },
    md: { price: 'text-2xl', symbol: 'text-sm', original: 'text-sm' },
    lg: { price: 'text-3xl', symbol: 'text-base', original: 'text-base' },
  };

  if (price === 0 && showFree) {
    return <span className={`${sizeClasses[size].price} font-bold text-green-600`}>免费</span>;
  }

  return (
    <div className="flex items-baseline gap-1">
      <span className={`${sizeClasses[size].symbol} text-red-500 font-medium`}>¥</span>
      <span className={`${sizeClasses[size].price} font-bold text-red-500`}>{price}</span>
      <span className={`${sizeClasses[size].symbol} text-gray-400`}>/{unit}</span>
      {originalPrice && originalPrice > price && (
        <span className={`${sizeClasses[size].original} text-gray-400 line-through ml-1`}>
          ¥{originalPrice}
        </span>
      )}
    </div>
  );
}
