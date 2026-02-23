'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: 'slash' | 'arrow' | 'dot';
  showHome?: boolean;
  className?: string;
}

// Path to label mapping
const pathLabels: Record<string, string> = {
  '': '首页',
  'search': '搜索结果',
  'category': '分类',
  'agents': 'Agent详情',
  'agent': 'Agent详情',
  'user': '个人中心',
  'favorites': '我的收藏',
  'orders': '我的订单',
  'developer': '开发者中心',
  'dashboard': '数据概览',
  'publish': '发布Agent',
  'purchase': '购买',
  'login': '登录',
  'register': '注册',
};

export default function Breadcrumb({
  items,
  separator = 'arrow',
  showHome = true,
  className = '',
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate items from pathname if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const paths = pathname.split('/').filter(Boolean);
    const result: BreadcrumbItem[] = [];

    if (showHome) {
      result.push({ label: '首页', href: '/', icon: '🏠' });
    }

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Skip dynamic route segments like [id]
      if (path.startsWith('[') && path.endsWith(']')) return;
      
      // Check if it's a number (ID)
      if (/^\d+$/.test(path)) return;

      result.push({
        label: pathLabels[path] || path,
        href: isLast ? undefined : currentPath,
      });
    });

    return result;
  })();

  const separatorIcons = {
    slash: '/',
    arrow: '›',
    dot: '•',
  };

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={`flex items-center text-sm ${className}`}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">
                {separatorIcons[separator]}
              </span>
            )}
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className={`flex items-center gap-1 ${isLast ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Compact breadcrumb for mobile
interface CompactBreadcrumbProps {
  backHref?: string;
  backLabel?: string;
  currentLabel: string;
}

export function CompactBreadcrumb({ 
  backHref = '/', 
  backLabel = '返回',
  currentLabel 
}: CompactBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href={backHref}
        className="flex items-center gap-1 text-gray-500 hover:text-orange-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{backLabel}</span>
      </Link>
      <span className="text-gray-400">|</span>
      <span className="text-gray-800 font-medium truncate">{currentLabel}</span>
    </div>
  );
}
