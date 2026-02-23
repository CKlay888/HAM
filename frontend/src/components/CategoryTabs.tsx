'use client';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function CategoryTabs({ tabs, activeTab, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1 ${activeTab === tab.id ? 'text-white/80' : 'text-gray-400'}`}>
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
