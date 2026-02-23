export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class Execution {
  id: string;
  userId: string; // 执行者
  agentId: string; // 执行的 Agent
  input: Record<string, any>; // 输入参数
  output?: Record<string, any>; // 输出结果
  status: ExecutionStatus;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
}
