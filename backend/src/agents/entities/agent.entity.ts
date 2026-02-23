export class Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  ownerId: string; // 创建者用户ID
  capabilities: string[]; // Agent 能力标签
  apiEndpoint?: string; // Agent 服务端点
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
