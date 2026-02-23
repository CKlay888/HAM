export enum PurchaseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class Purchase {
  id: string;
  userId: string; // 购买者
  agentId: string; // 购买的 Agent
  amount: number; // 支付金额
  currency: string;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
}
