import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  ManyToOne, JoinColumn 
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',           // 充值
  WITHDRAWAL = 'withdrawal',     // 提现
  EXECUTION = 'execution',       // 执行 Agent 消费
  BOUNTY_ESCROW = 'bounty_escrow',     // 悬赏托管
  BOUNTY_RELEASE = 'bounty_release',   // 悬赏释放给接单者
  BOUNTY_REFUND = 'bounty_refund',     // 悬赏退款
  EARNING = 'earning',           // 作为创建者获得收入
  REFUND = 'refund',             // 退款
  PLATFORM_FEE = 'platform_fee'  // 平台手续费
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  wallet_id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  balance_before: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  balance_after: number;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true })
  reference_type: string; // 'execution', 'bounty', 'withdrawal_request'

  @Column('uuid', { nullable: true })
  reference_id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  // 关联
  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}
