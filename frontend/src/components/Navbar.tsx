'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockUser } from '@/lib/mock-data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = mockUser;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HAM
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              市场
            </Link>
            <Link href="/user" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              我的
            </Link>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              开发者
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              文档
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">¥{user.balance.toFixed(2)}</span>
            </div>

            {/* Avatar */}
            <Link href="/user" className="flex items-center gap-2">
              <img 
                src={user.avatar} 
                alt={user.displayName}
                className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.displayName}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              市场
            </Link>
            <Link href="/user" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              我的
            </Link>
            <a href="#" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              开发者
            </a>
            <a href="#" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              文档
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
