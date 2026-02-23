'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  align?: 'left' | 'right' | 'center';
  width?: 'auto' | 'full' | number;
  className?: string;
}

export default function Dropdown({
  trigger,
  items,
  onSelect,
  align = 'left',
  width = 'auto',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onSelect(item.id);
    setIsOpen(false);
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const widthStyle = typeof width === 'number' ? { width: `${width}px` } : {};
  const widthClass = width === 'full' ? 'w-full' : width === 'auto' ? 'min-w-[160px]' : '';

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 py-1 bg-white rounded-xl shadow-lg border border-gray-100
            ${alignClasses[align]} ${widthClass}
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
          style={widthStyle}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-1 border-t border-gray-100" />;
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : item.danger 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Select Dropdown (single selection)
interface SelectDropdownProps {
  options: Array<{ value: string; label: string; icon?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  className = '',
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-3 border rounded-xl bg-white
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
          ${isOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200'}
        `}
      >
        <span className={selectedOption ? 'text-gray-800' : 'text-gray-400'}>
          {selectedOption?.icon && <span className="mr-2">{selectedOption.icon}</span>}
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`
                w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors
                ${value === option.value ? 'bg-orange-50 text-orange-500' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
              {value === option.value && (
                <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// User Dropdown (profile menu)
interface UserDropdownProps {
  user: { name: string; email?: string; avatar?: string };
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function UserDropdown({ user, onProfile, onSettings, onLogout }: UserDropdownProps) {
  const items: DropdownItem[] = [
    { id: 'profile', label: '个人中心', icon: '👤' },
    { id: 'settings', label: '设置', icon: '⚙️' },
    { id: 'divider', label: '', divider: true },
    { id: 'logout', label: '退出登录', icon: '🚪', danger: true },
  ];

  const handleSelect = (id: string) => {
    if (id === 'profile') onProfile?.();
    if (id === 'settings') onSettings?.();
    if (id === 'logout') onLogout?.();
  };

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
              {user.name[0]}
            </div>
          )}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      }
      items={items}
      onSelect={handleSelect}
      align="right"
      width={180}
    />
  );
}
