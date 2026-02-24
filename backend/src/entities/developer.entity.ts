import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, OneToMany, JoinColumn, Index
} from 'typeorm';
import { User } from './user.entity';

export enum DeveloperStatus {
  PENDING = 'pending',       // 待审核
  APPROVED = 'approved',     // 已通过
  REJECTED = 'rejected',     // 已拒绝
  SUSPENDED = 'suspended'    // 已暂停
}

export enum DeveloperLevel {
  STARTER = 'starter',       // 入门开发者
  BRONZE = 'bronze',         // 青铜开发者
  SILVER = 'silver',         // 白银开发者
  GOLD = 'gold',             // 黄金开发者
  PLATINUM = 'platinum'      // 白金开发者
}

@Entity('developers')
@Index(['status'])
@Index(['level'])
export class Developer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ type: 'enum', enum: DeveloperStatus, default: DeveloperStatus.PENDING })
  status: DeveloperStatus;

  @Column({ type: 'enum', enum: DeveloperLevel, default: DeveloperLevel.STARTER })
  level: DeveloperLevel;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0.70 })
  commission_rate: number; // 分成比例，默认70%

  @Column({ default: 0 })
  agent_count: number;

  @Column({ default: 0 })
  active_agent_count: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_revenue: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_withdrawn: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column({ default: 0 })
  total_sales: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5 })
  avg_rating: number;

  @Column({ type: 'jsonb', nullable: true })
  verification: {
    id_verified?: boolean;
    company_verified?: boolean;
    documents?: string[];
  };

  @Column({ type: 'text', nullable: true })
  reject_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DeveloperEarning, earning => earning.developer)
  earnings: DeveloperEarning[];

  @OneToMany(() => Withdrawal, withdrawal => withdrawal.developer)
  withdrawals: Withdrawal[];
}

@Entity('developer_earnings')
@Index(['developer_id', 'created_at'])
@Index(['agent_id'])
export class DeveloperEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  developer_id: string;

  @Column('uuid')
  agent_id: string;

  @Column('uuid')
  order_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  order_amount: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  commission_rate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  platform_fee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  earning_amount: number;

  @Column({ default: 'settled' })
  status: string; // pending, settled, refunded

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  settled_at: Date;

  @ManyToOne(() => Developer, developer => developer.earnings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'developer_id' })
  developer: Developer;
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum WithdrawalMethod {
  BANK = 'bank',
  ALIPAY = 'alipay',
  PAYPAL = 'paypal'
}

@Entity('withdrawals')
@Index(['developer_id', 'status', 'created_at'])
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 32 })
  withdrawal_no: string;

  @Column('uuid')
  developer_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  actual_amount: number;

  @Column({ type: 'enum', enum: WithdrawalMethod })
  method: WithdrawalMethod;

  @Column({ type: 'jsonb' })
  account_info: {
    bank_name?: string;
    bank_account?: string;
    account_name?: string;
    alipay_account?: string;
    paypal_email?: string;
  };

  @Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  status: WithdrawalStatus;

  @Column({ type: 'text', nullable: true })
  reject_reason: string;

  @Column({ type: 'uuid', nullable: true })
  admin_id: string;

  @Column({ type: 'text', nullable: true })
  admin_remark: string;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Developer, developer => developer.withdrawals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'developer_id' })
  developer: Developer;
}
