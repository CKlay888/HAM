'use client';

import Link from 'next/link';
import { Agent } from '@/types';
import ReliabilityBadge from './ReliabilityBadge';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agent/${agent.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="w-12 h-12 rounded-xl bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {agent.name}
              </h3>
              {agent.isVerified && (
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{agent.tagline}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
            {agent.category}
          </span>
          {agent.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-gray-900">{agent.rating}</span>
              <span className="text-gray-400">({agent.reviewCount})</span>
            </div>
            <ReliabilityBadge grade={agent.reliabilityGrade} size="sm" />
          </div>
          <span className="text-gray-400">{(agent.callCount / 1000).toFixed(1)}k 次调用</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img 
              src={agent.creatorAvatar} 
              alt={agent.creatorName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs text-gray-500">{agent.creatorName}</span>
          </div>
          <span className={`font-semibold ${agent.priceType === 'free' ? 'text-green-600' : 'text-blue-600'}`}>
            {agent.priceDisplay}
          </span>
        </div>

        {/* Featured Badge */}
        {agent.isFeatured && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            精选
          </div>
        )}
      </div>
    </Link>
  );
}
