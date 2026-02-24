import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  ManyToOne, JoinColumn 
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  // 执行相关
  EXECUTION_STARTED = 'execution_started',
  EXECUTION_COMPLETED = 'execution_completed',
  EXECUTION_FAILED = 'execution_failed',
  
  // 悬赏相关
  BOUNTY_ACCEPTED = 'bounty_accepted',
  BOUNTY_SUBMITTED = 'bounty_submitted',
  BOUNTY_COMPLETED = 'bounty_completed',
  BOUNTY_DISPUTED = 'bounty_disputed',
  BOUNTY_EXPIRED = 'bounty_expired',
  
  // 钱包相关
  DEPOSIT_COMPLETED = 'deposit_completed',
  WITHDRAWAL_COMPLETED = 'withdrawal_completed',
  WITHDRAWAL_FAILED = 'withdrawal_failed',
  LOW_BALANCE = 'low_balance',
  
  // Agent 相关
  AGENT_APPROVED = 'agent_approved',
  AGENT_SUSPENDED = 'agent_suspended',
  NEW_SUBSCRIBER = 'new_subscriber',
  
  // 系统
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  WEBSOCKET = 'websocket',
  PUSH = 'push'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>; // 额外数据，如 execution_id, bounty_id 等

  @Column({ type: 'simple-array', default: 'in_app' })
  channels: NotificationChannel[];

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  read_at: Date;

  @Column({ nullable: true })
  action_url: string; // 点击通知后跳转的 URL

  @CreateDateColumn()
  created_at: Date;

  // 关联
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
