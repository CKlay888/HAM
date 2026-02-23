'use client';

import Link from 'next/link';
import { Agent } from '@/types';

interface HotSectionProps {
  title: string;
  subtitle?: string;
  agents: Agent[];
  type?: 'hot' | 'sale' | 'new';
}

export default function HotSection({ title, subtitle, agents, type = 'hot' }: HotSectionProps) {
  const bgColor = {
    hot: 'from-red-500 to-orange-500',
    sale: 'from-orange-500 to-yellow-500',
    new: 'from-blue-500 to-cyan-500',
  }[type];

  const iconBg = {
    hot: '🔥',
    sale: '💰',
    new: '✨',
  }[type];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className={`bg-gradient-to-r ${bgColor} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{iconBg}</span>
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
        </div>
        <Link href="/" className="text-white/90 text-sm hover:text-white">
          查看更多 →
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agents.slice(0, 4).map((agent, index) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <div className="group cursor-pointer">
                {/* Rank Badge */}
                {type === 'hot' && index < 3 && (
                  <div className="relative">
                    <div className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                )}
                
                <div className="aspect-square bg-gray-50 rounded-lg p-3 mb-2 group-hover:bg-orange-50 transition-colors">
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600">
                  {agent.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-1">
                  {agent.priceType === 'free' ? (
                    <span className="text-green-600 font-bold">免费</span>
                  ) : (
                    <>
                      <span className="text-red-500 text-xs">¥</span>
                      <span className="text-red-500 font-bold">{agent.priceDisplay.replace(/[^\d.]/g, '')}</span>
                    </>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{(agent.callCount / 1000).toFixed(0)}k销量</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
