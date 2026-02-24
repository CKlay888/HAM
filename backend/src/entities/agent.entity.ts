import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, ManyToOne, JoinColumn, OneToMany 
} from 'typeorm';
import { User } from './user.entity';
import { Execution } from './execution.entity';

export enum AgentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEPRECATED = 'deprecated'
}

export enum PricingModel {
  PER_CALL = 'per_call',       // 按次计费
  SUBSCRIPTION = 'subscription', // 订阅制
  BUYOUT = 'buyout',           // 买断制
  FREE = 'free'                // 免费
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  creator_id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-array' })
  task_types: string[]; // ['translation', 'code_review', 'writing']

  @Column({ type: 'enum', enum: AgentStatus, default: AgentStatus.DRAFT })
  status: AgentStatus;

  @Column({ type: 'enum', enum: PricingModel })
  pricing_model: PricingModel;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost_per_call: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subscription_price_monthly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  buyout_price: number;

  // 性能指标
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  avg_latency_ms: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 1 })
  reliability: number; // 0-1

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  value_score: number; // 综合评分

  // 统计
  @Column({ default: 0 })
  total_executions: number;

  @Column({ default: 0 })
  successful_executions: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_revenue: number;

  @Column({ default: 0 })
  active_subscribers: number;

  // Agent 配置（模拟 AI 调用）
  @Column({ type: 'jsonb', nullable: true })
  config: {
    model?: string;           // 'gpt-4', 'claude-3', etc.
    system_prompt?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: string[];
  };

  @Column({ nullable: true })
  api_endpoint: string; // 外部 Agent 的 API 地址

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 关联
  @ManyToOne(() => User, user => user.created_agents)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Execution, execution => execution.agent)
  executions: Execution[];
}
