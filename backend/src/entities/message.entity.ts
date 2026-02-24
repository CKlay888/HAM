import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, Index
} from 'typeorm';
import { User } from './user.entity';

export enum MessageType {
  PRIVATE = 'private',           // 私信
  SYSTEM = 'system',             // 系统通知
  ANNOUNCEMENT = 'announcement', // 公告
  ORDER = 'order',               // 订单相关
  REVIEW = 'review',             // 评论相关
  BOUNTY = 'bounty'              // 悬赏相关
}

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

@Entity('messages')
@Index(['receiver_id', 'status', 'created_at'])
@Index(['sender_id', 'created_at'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  sender_id: string;

  @Column('uuid')
  receiver_id: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.PRIVATE })
  type: MessageType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.UNREAD })
  status: MessageStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    related_id?: string;      // 关联ID（订单ID、评论ID等）
    related_type?: string;    // 关联类型
    action_url?: string;      // 跳转链接
    image_url?: string;       // 图片
  };

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'info' })
  level: string; // info, warning, important

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  start_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_at: Date;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ nullable: true })
  target_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
