'use client';

import { useState } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  bordered?: boolean;
  rounded?: 'full' | 'lg' | 'md';
  onClick?: () => void;
  className?: string;
}

const sizeConfig: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-2 h-2 -right-0.5 -bottom-0.5' },
  sm: { container: 'w-8 h-8', text: 'text-sm', status: 'w-2.5 h-2.5 right-0 bottom-0' },
  md: { container: 'w-10 h-10', text: 'text-base', status: 'w-3 h-3 right-0 bottom-0' },
  lg: { container: 'w-12 h-12', text: 'text-lg', status: 'w-3.5 h-3.5 right-0.5 bottom-0.5' },
  xl: { container: 'w-16 h-16', text: 'text-xl', status: 'w-4 h-4 right-0.5 bottom-0.5' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl', status: 'w-5 h-5 right-1 bottom-1' },
};

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

// Generate color from name
function getColorFromName(name: string): string {
  const colors = [
    'bg-orange-500', 'bg-red-500', 'bg-pink-500', 'bg-purple-500',
    'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
    'bg-green-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  bordered = false,
  rounded = 'full',
  onClick,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const config = sizeConfig[size];
  
  const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md';
  const borderClass = bordered ? 'ring-2 ring-white shadow-md' : '';
  const cursorClass = onClick ? 'cursor-pointer hover:opacity-80' : '';

  const showFallback = !src || imageError;

  return (
    <div 
      className={`relative inline-block ${className}`}
      onClick={onClick}
    >
      {showFallback ? (
        <div 
          className={`${config.container} ${roundedClass} ${borderClass} ${cursorClass} ${name ? getColorFromName(name) : 'bg-gray-300'} flex items-center justify-center text-white font-medium`}
        >
          <span className={config.text}>
            {name ? getInitials(name) : '?'}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          onError={() => setImageError(true)}
          className={`${config.container} ${roundedClass} ${borderClass} ${cursorClass} object-cover`}
        />
      )}
      
      {status && (
        <span 
          className={`absolute ${config.status} ${statusColors[status]} rounded-full border-2 border-white`}
        />
      )}
    </div>
  );
}

// Avatar Group
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          bordered
          className="relative"
          style={{ zIndex: visibleAvatars.length - index }}
        />
      ))}
      {remaining > 0 && (
        <div className={`${sizeConfig[size].container} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium ring-2 ring-white ${sizeConfig[size].text}`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}

// Editable Avatar
interface EditableAvatarProps extends AvatarProps {
  onEdit?: () => void;
}

export function EditableAvatar({ onEdit, ...props }: EditableAvatarProps) {
  return (
    <div className="relative inline-block group">
      <Avatar {...props} />
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
