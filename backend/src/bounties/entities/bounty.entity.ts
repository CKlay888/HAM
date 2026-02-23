export enum BountyStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class BountyApplication {
  id: string;
  bountyId: string;
  applicantId: string;
  proposal: string; // 申请说明
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export class BountyDelivery {
  id: string;
  bountyId: string;
  deliverables: string;
  attachments?: string[];
  notes?: string;
  submittedAt: Date;
}

export class Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  currency: string;
  status: BountyStatus;
  creatorId: string;
  assigneeId?: string;
  deadline: Date;
  category: string;
  requirements: string;
  deliverables: string;
  applications: BountyApplication[];
  delivery?: BountyDelivery;
  createdAt: Date;
  updatedAt: Date;
}
