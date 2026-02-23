export class Review {
  id: string;
  userId: string; // 评论者
  agentId: string; // 被评论的 Agent
  rating: number; // 1-5 星
  content: string; // 评论内容
  createdAt: Date;
  updatedAt: Date;
}
