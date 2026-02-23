'use client';

import { useState, createContext, useContext } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-6',
  };

  const baseTabClass = `flex items-center gap-2 font-medium transition-all ${sizeClasses[size]}`;
  
  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      active: 'text-orange-500 border-b-2 border-orange-500 -mb-px',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-xl',
      active: 'bg-white text-orange-500 rounded-lg shadow-sm',
      inactive: 'text-gray-500 hover:text-gray-700 rounded-lg',
    },
    underline: {
      container: '',
      active: 'text-orange-500 border-b-2 border-orange-500',
      inactive: 'text-gray-500 hover:text-orange-500 border-b-2 border-transparent',
    },
    enclosed: {
      container: 'border-b border-gray-200',
      active: 'bg-white text-orange-500 border border-gray-200 border-b-white rounded-t-lg -mb-px',
      inactive: 'text-gray-500 hover:text-gray-700 bg-gray-50 border border-transparent',
    },
  };

  const classes = variantClasses[variant];

  return (
    <div className={`flex ${fullWidth ? '' : 'w-fit'} ${classes.container} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            ${baseTabClass}
            ${fullWidth ? 'flex-1 justify-center' : ''}
            ${activeTab === tab.id ? classes.active : classes.inactive}
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {tab.badge > 99 ? '99+' : tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Tab Panels for content
interface TabPanelsProps {
  activeTab: string;
  children: React.ReactNode;
}

interface TabPanelProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContext = createContext<string>('');

export function TabPanels({ activeTab, children }: TabPanelsProps) {
  return (
    <TabContext.Provider value={activeTab}>
      {children}
    </TabContext.Provider>
  );
}

export function TabPanel({ tabId, children }: TabPanelProps) {
  const activeTab = useContext(TabContext);
  if (activeTab !== tabId) return null;
  return <div className="animate-in fade-in duration-200">{children}</div>;
}

// Vertical Tabs
interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function VerticalTabs({ tabs, activeTab, onChange, className = '' }: VerticalTabsProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all
            ${activeTab === tab.id 
              ? 'bg-orange-50 text-orange-500 border-l-4 border-orange-500' 
              : 'text-gray-600 hover:bg-gray-50'
            }
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {tab.icon && <span className="text-lg">{tab.icon}</span>}
          <span className="flex-1">{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Scrollable Tabs (for mobile)
interface ScrollableTabsProps extends TabsProps {
  showIndicator?: boolean;
}

export function ScrollableTabs({ tabs, activeTab, onChange, showIndicator = true }: ScrollableTabsProps) {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-4 border-b border-gray-200 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center gap-2 py-3 font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'text-orange-500 border-b-2 border-orange-500 -mb-px' 
                  : 'text-gray-500'
                }
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {showIndicator && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </>
      )}
    </div>
  );
}
