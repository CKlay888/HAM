'use client';

import { ReliabilityGrade } from '@/types';

interface ReliabilityBadgeProps {
  grade: ReliabilityGrade;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const gradeConfig = {
  A: {
    color: 'bg-green-500',
    textColor: 'text-green-500',
    bgLight: 'bg-green-50',
    label: '优秀',
    description: '成功率 95%+',
  },
  B: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    bgLight: 'bg-yellow-50',
    label: '良好',
    description: '成功率 85-95%',
  },
  C: {
    color: 'bg-red-500',
    textColor: 'text-red-500',
    bgLight: 'bg-red-50',
    label: '一般',
    description: '成功率 <85%',
  },
};

const sizeConfig = {
  sm: 'w-5 h-5 text-xs',
  md: 'w-6 h-6 text-sm',
  lg: 'w-8 h-8 text-base',
};

export default function ReliabilityBadge({ 
  grade, 
  showLabel = false,
  size = 'md' 
}: ReliabilityBadgeProps) {
  const config = gradeConfig[grade];
  
  return (
    <div className="flex items-center gap-1.5">
      <div 
        className={`${sizeConfig[size]} ${config.color} rounded-full flex items-center justify-center text-white font-bold`}
        title={`${config.label} - ${config.description}`}
      >
        {grade}
      </div>
      {showLabel && (
        <span className={`${config.textColor} text-sm font-medium`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
