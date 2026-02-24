import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, ManyToOne, JoinColumn 
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';

export enum ExecutionStatus {
  QUEUED = 'queued',       // 排队中
  RUNNING = 'running',     // 执行中
  COMPLETED = 'completed', // 完成
  FAILED = 'failed',       // 失败
  CANCELLED = 'cancelled', // 已取消
  TIMEOUT = 'timeout'      // 超时
}

@Entity('executions')
export class Execution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  agent_id: string;

  @Column({ type: 'enum', enum: ExecutionStatus, default: ExecutionStatus.QUEUED })
  status: ExecutionStatus;

  // 输入输出
  @Column({ type: 'jsonb' })
  input: {
    task: string;
    parameters?: Record<string, any>;
    context?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  output: {
    result?: any;
    error?: string;
    metadata?: Record<string, any>;
  };

  // 质量指标
  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  confidence_score: number; // 0-1

  @Column({ type: 'int', nullable: true })
  tokens_used: number;

  // 计费
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_charged: number;

  @Column('uuid', { nullable: true })
  transaction_id: string;

  // 时间追踪
  @Column({ nullable: true })
  started_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ type: 'int', nullable: true })
  duration_ms: number;

  // 队列信息
  @Column({ default: 0 })
  queue_position: number;

  @Column({ nullable: true })
  worker_id: string;

  // 重试信息
  @Column({ default: 0 })
  retry_count: number;

  @Column({ default: 3 })
  max_retries: number;

  @Column({ nullable: true })
  last_error: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 关联
  @ManyToOne(() => User, user => user.executions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Agent, agent => agent.executions)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;
}
