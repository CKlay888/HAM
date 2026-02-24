import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index, Unique
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  HIDDEN = 'hidden'
}

@Entity('reviews')
@Unique(['user_id', 'agent_id'])
@Index(['agent_id', 'status', 'created_at'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  agent_id: string;

  @Column({ type: 'uuid', nullable: true })
  order_id: string;

  @Column({ type: 'smallint' })
  rating: number; // 1-5

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.APPROVED })
  status: ReviewStatus;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: 0 })
  reply_count: number;

  @Column({ default: false })
  is_anonymous: boolean;

  @Column({ type: 'text', nullable: true })
  developer_reply: string;

  @Column({ type: 'timestamp', nullable: true })
  developer_reply_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @OneToMany(() => ReviewReply, reply => reply.review)
  replies: ReviewReply[];
}

@Entity('review_replies')
@Index(['review_id', 'created_at'])
export class ReviewReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  review_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  like_count: number;

  @Column({ default: false })
  is_developer: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Review, review => review.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ReviewReply, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: ReviewReply;
}

@Entity('review_likes')
@Unique(['user_id', 'review_id'])
export class ReviewLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  review_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;
}

@Entity('review_reports')
@Unique(['user_id', 'review_id'])
export class ReviewReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  review_id: string;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: string; // pending, resolved, rejected

  @Column({ type: 'text', nullable: true })
  admin_note: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;
}
