'use client';

const categories = [
  { id: 'all', name: '全部', icon: '🏠', color: 'bg-orange-500' },
  { id: 'dev', name: '开发工具', icon: '💻', color: 'bg-blue-500' },
  { id: 'content', name: '内容创作', icon: '✍️', color: 'bg-pink-500' },
  { id: 'data', name: '数据分析', icon: '📊', color: 'bg-green-500' },
  { id: 'design', name: '设计工具', icon: '🎨', color: 'bg-purple-500' },
  { id: 'lang', name: '语言翻译', icon: '🌍', color: 'bg-cyan-500' },
  { id: 'pro', name: '专业服务', icon: '💼', color: 'bg-amber-500' },
  { id: 'edu', name: '教育学习', icon: '📚', color: 'bg-indigo-500' },
  { id: 'life', name: '生活助手', icon: '🏡', color: 'bg-rose-500' },
  { id: 'hot', name: '热门榜单', icon: '🔥', color: 'bg-red-500' },
];

interface CategoryNavProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryNav({ selected, onSelect }: CategoryNavProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              selected === cat.id
                ? 'bg-orange-50 text-orange-600'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className={`w-10 h-10 ${cat.color} rounded-full flex items-center justify-center text-xl mb-1`}>
              {cat.icon}
            </span>
            <span className="text-xs font-medium truncate w-full text-center">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
