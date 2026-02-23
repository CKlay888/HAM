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

// ==================== 悬赏系统类型 ====================

export type BountyStatus = 'open' | 'in_progress' | 'review' | 'escrow' | 'completed';
export type SubmissionStatus = 'submitted' | 'under_review' | 'revision' | 'working' | 'accepted' | 'completed';
export type Urgency = 'high' | 'medium' | 'low';
export type PosterType = 'individual' | 'company';

export interface BountyUser {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  bio: string;
  verified: boolean;
  type: 'individual' | 'company';
}

export interface Feedback {
  from: string;
  text: string;
  time: string;
  type: 'revision' | 'reply' | 'approve' | 'complete';
}

export interface EscrowInfo {
  buyerPaid: boolean;
  sellerUploaded: boolean;
  review: 'pending' | 'in_progress' | 'passed';
  paidTime?: string;
  uploadTime?: string;
  doneTime?: string;
}

export interface SubmissionFile {
  name: string;
  size: string;
}

export interface BountySubmission {
  id: string;
  uid: string;
  time: string;
  status: SubmissionStatus;
  price: number;
  days: number;
  pitch: string;
  demoUrl?: string;
  demoDesc?: string;
  tech: string;
  files: SubmissionFile[];
  feedbacks: Feedback[];
  escrow?: EscrowInfo;
}

export interface Bounty {
  id: string;
  title: string;
  reward: number;
  uid: string;
  posterType: PosterType;
  urgency: Urgency;
  deadline: string;
  status: BountyStatus;
  desc: string;
  tags: string[];
  submissions: BountySubmission[];
}

export interface Video {
  id: string;
  uid: string;
  type: 'showcase' | 'bounty' | 'daily';
  title: string;
  desc: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  gradient: string;
  time: string;
  agentId?: string;
  bountyId?: string;
}
