'use client';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ 
  size = 'md', 
  color = 'orange', 
  text,
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    orange: 'border-orange-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  const spinner = (
    <div className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {spinner}
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

// Skeleton loader
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  count = 1 
}: SkeletonProps) {
  const baseClass = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'text' ? '16px' : variant === 'circular' ? '40px' : '100px'),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Skeleton variant="rectangular" height={160} className="mb-4" />
      <Skeleton className="mb-2" width="60%" />
      <Skeleton className="mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton width={80} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

// Page loading
export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Skeleton height={200} className="rounded-xl mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Button loading
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonLoading({ 
  loading = false, 
  children, 
  className = '',
  onClick,
  disabled 
}: ButtonLoadingProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative ${className} ${loading ? 'text-transparent' : ''}`}
    >
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
