// HAM 核心类型定义

export type ReliabilityGrade = 'A' | 'B' | 'C';
export type PriceType = 'free' | 'per_use' | 'subscription' | 'perpetual';

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  callCount: number;
  priceType: PriceType;
  priceDisplay: string;
  reliabilityGrade: ReliabilityGrade;
  successRate: number;
  avgResponseTime: number;
  uptime: number;
  isVerified: boolean;
  isFeatured: boolean;
  creatorName: string;
  creatorAvatar: string;
  capabilities: string[];
  modelBase: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  unit: string;
  quota: number | null;
  features: string[];
  isRecommended: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  email: string;
  balance: number;
  role: 'user' | 'developer' | 'admin';
}

export interface Subscription {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  used: number;
  total: number | null;
}

export interface UsageRecord {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  status: 'success' | 'failed';
  responseTime: number;
  cost: number;
}
