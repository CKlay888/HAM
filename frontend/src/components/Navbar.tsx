'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockUser } from '@/lib/mock-data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = mockUser;

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-orange-500 font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-white">HAM</span>
            <span className="hidden sm:block text-white/80 text-sm ml-2">| AI Agent 市场</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜索你想要的Agent..."
                className="w-full px-4 py-2 rounded-l-full border-0 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button className="absolute right-0 top-0 h-full px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-r-full font-medium transition-colors">
                搜索
              </button>
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className="hidden sm:flex items-center gap-1 text-white">
              <span className="text-white/80 text-sm">余额:</span>
              <span className="font-bold">¥{user.balance.toFixed(0)}</span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-4 text-white text-sm">
              <Link href="/user" className="hover:text-white/80 transition-colors">
                我的订单
              </Link>
              <Link href="/user" className="hover:text-white/80 transition-colors">
                我的收藏
              </Link>
            </div>

            {/* User */}
            <Link href="/user" className="flex items-center gap-2 text-white">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-8 h-8 rounded-full border-2 border-white/50"
              />
              <span className="hidden sm:block text-sm">{user.displayName}</span>
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索Agent..."
              className="w-full px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-orange-600 text-white text-sm rounded-full">
              搜索
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
              首页
            </Link>
            <Link href="/user" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
              我的订单
            </Link>
            <Link href="/user" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
              我的收藏
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
