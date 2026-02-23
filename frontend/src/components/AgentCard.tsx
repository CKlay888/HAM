'use client';

import Link from 'next/link';
import { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const price = agent.priceType === 'free' ? 0 : parseFloat(agent.priceDisplay.replace(/[^\d.]/g, ''));
  const originalPrice = price > 0 ? (price * 1.5).toFixed(0) : null;

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* 角标 */}
          {agent.isFeatured && (
            <div className="absolute top-0 left-0">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg font-medium">
                HOT
              </div>
            </div>
          )}
          
          {/* 优惠角标 */}
          {price > 0 && (
            <div className="absolute top-0 right-0">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                限时优惠
              </div>
            </div>
          )}

          {/* 销量标签 */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {(agent.callCount / 1000).toFixed(1)}k人在用
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3 className="font-medium text-gray-800 text-sm leading-tight mb-2 line-clamp-2 min-h-[40px] group-hover:text-orange-600 transition-colors">
            {agent.name} {agent.tagline}
          </h3>

          {/* Tags */}
          <div className="flex items-center gap-1 mb-2">
            <span className="px-1.5 py-0.5 bg-red-50 text-red-500 text-xs rounded border border-red-200">
              官方认证
            </span>
            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-500 text-xs rounded border border-orange-200">
              极速响应
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            {agent.priceType === 'free' ? (
              <span className="text-lg font-bold text-green-600">免费</span>
            ) : (
              <>
                <span className="text-xs text-red-500">¥</span>
                <span className="text-xl font-bold text-red-500">{price}</span>
                <span className="text-xs text-gray-400">/{agent.priceType === 'subscription' ? '月' : '次'}</span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through">¥{originalPrice}</span>
                )}
              </>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-medium text-gray-700">{agent.rating}</span>
              <span className="text-xs text-gray-400">({agent.reviewCount}评价)</span>
            </div>
            
            {/* Buy Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/purchase/${agent.id}`;
              }}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-medium hover:from-orange-600 hover:to-red-600 transition-all"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
