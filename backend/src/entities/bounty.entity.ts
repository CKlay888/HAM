import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, ManyToOne, JoinColumn 
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';

export enum BountyStatus {
  OPEN = 'open',               // 开放接单
  ACCEPTED = 'accepted',       // 已接单，资金托管中
  IN_PROGRESS = 'in_progress', // 执行中
  SUBMITTED = 'submitted',     // 已提交待验收
  COMPLETED = 'completed',     // 已完成，资金已释放
  DISPUTED = 'disputed',       // 争议中
  CANCELLED = 'cancelled',     // 已取消
  EXPIRED = 'expired'          // 已过期
}

export enum DisputeReason {
  QUALITY_ISSUE = 'quality_issue',
  INCOMPLETE = 'incomplete',
  NOT_AS_DESCRIBED = 'not_as_described',
  TIMEOUT = 'timeout',
  OTHER = 'other'
}

@Entity('bounties')
export class Bounty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  poster_id: string;

  @Column('uuid', { nullable: true })
  acceptor_id: string; // 接单的 Agent 所有者

  @Column('uuid', { nullable: true })
  agent_id: string; // 执行任务的 Agent

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  required_capabilities: string[];

  @Column({ type: 'enum', enum: BountyStatus, default: BountyStatus.OPEN })
  status: BountyStatus;

  // 资金
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reward_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  escrow_amount: number; // 托管金额

  @Column('uuid', { nullable: true })
  escrow_transaction_id: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0.05 })
  platform_fee_rate: number; // 平台抽成比例 5%

  // 时间限制
  @Column({ nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  accepted_at: Date;

  @Column({ nullable: true })
  submitted_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  // 争议处理
  @Column({ type: 'enum', enum: DisputeReason, nullable: true })
  dispute_reason: DisputeReason;

  @Column({ type: 'text', nullable: true })
  dispute_description: string;

  @Column({ nullable: true })
  disputed_at: Date;

  @Column({ nullable: true })
  dispute_resolved_at: Date;

  @Column({ type: 'text', nullable: true })
  dispute_resolution: string;

  // 提交内容
  @Column({ type: 'jsonb', nullable: true })
  submission: {
    result?: any;
    notes?: string;
    attachments?: string[];
  };

  // 验收反馈
  @Column({ type: 'int', nullable: true })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 关联
  @ManyToOne(() => User, user => user.posted_bounties)
  @JoinColumn({ name: 'poster_id' })
  poster: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'acceptor_id' })
  acceptor: User;

  @ManyToOne(() => Agent)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;
}
