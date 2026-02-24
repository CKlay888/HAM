import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index 
} from 'typeorm';

export enum StatsPeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum StatsType {
  AGENT = 'agent',
  USER = 'user',
  PLATFORM = 'platform'
}

// Agent 统计表
@Entity('agent_statistics')
@Index(['agent_id', 'period', 'period_start'], { unique: true })
export class AgentStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agent_id: string;

  @Column({ type: 'enum', enum: StatsPeriod })
  period: StatsPeriod;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ default: 0 })
  total_executions: number;

  @Column({ default: 0 })
  successful_executions: number;

  @Column({ default: 0 })
  failed_executions: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  revenue: number;

  @Column({ default: 0 })
  unique_users: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  avg_latency_ms: number;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  success_rate: number;

  @Column({ default: 0 })
  new_subscribers: number;

  @Column({ default: 0 })
  churned_subscribers: number;

  @CreateDateColumn()
  created_at: Date;
}

// 用户统计表
@Entity('user_statistics')
@Index(['user_id', 'period', 'period_start'], { unique: true })
export class UserStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'enum', enum: StatsPeriod })
  period: StatsPeriod;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_spent: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_earned: number;

  @Column({ default: 0 })
  executions_count: number;

  @Column({ default: 0 })
  bounties_posted: number;

  @Column({ default: 0 })
  bounties_completed: number;

  @Column({ default: 0 })
  unique_agents_used: number;

  @CreateDateColumn()
  created_at: Date;
}

// 平台统计表
@Entity('platform_statistics')
@Index(['period', 'period_start'], { unique: true })
export class PlatformStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StatsPeriod })
  period: StatsPeriod;

  @Column({ type: 'date' })
  period_start: Date;

  // 交易量
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_volume: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  platform_revenue: number; // 手续费收入

  // 执行量
  @Column({ default: 0 })
  total_executions: number;

  @Column({ default: 0 })
  successful_executions: number;

  // 用户活跃度
  @Column({ default: 0 })
  active_users: number;

  @Column({ default: 0 })
  new_users: number;

  // Agent 数据
  @Column({ default: 0 })
  active_agents: number;

  @Column({ default: 0 })
  new_agents: number;

  // 悬赏数据
  @Column({ default: 0 })
  bounties_posted: number;

  @Column({ default: 0 })
  bounties_completed: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  bounty_volume: number;

  @CreateDateColumn()
  created_at: Date;
}
