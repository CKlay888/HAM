'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const hotSearches = ['代码助手', '文案生成', '数据分析', '翻译', '设计', 'AI写作'];

interface SearchBarProps {
  defaultValue?: string;
  showHotSearch?: boolean;
  onSearch?: (keyword: string) => void;
}

export default function SearchBar({ defaultValue = '', showHotSearch = true, onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = () => {
    if (keyword.trim()) {
      if (onSearch) {
        onSearch(keyword);
      } else {
        router.push(`/search?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索你想要的Agent..."
          className="flex-1 px-4 py-3 border-2 border-orange-500 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          onClick={handleSearch}
          className="px-8 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-r-full hover:from-orange-600 hover:to-red-600 transition-all"
        >
          搜索
        </button>
      </div>

      {showHotSearch && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-gray-500">🔥 热搜:</span>
          {hotSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setKeyword(term);
                if (onSearch) {
                  onSearch(term);
                } else {
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }
              }}
              className="text-xs text-gray-600 hover:text-orange-500 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
