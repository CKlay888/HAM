import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';

export enum OrderStatus {
  PENDING = 'pending',           // 待支付
  PAID = 'paid',                 // 已支付
  PROCESSING = 'processing',     // 处理中
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  REFUND_PENDING = 'refund_pending',   // 退款中
  REFUNDED = 'refunded',         // 已退款
  REFUND_REJECTED = 'refund_rejected', // 退款被拒
  EXPIRED = 'expired'            // 已过期
}

export enum OrderType {
  PER_CALL = 'per_call',           // 按次购买
  SUBSCRIPTION = 'subscription',    // 订阅
  BUYOUT = 'buyout',               // 买断
  RECHARGE = 'recharge'            // 充值
}

export enum PaymentMethod {
  BALANCE = 'balance',         // 余额支付
  ALIPAY = 'alipay',          // 支付宝
  WECHAT = 'wechat',          // 微信支付
  STRIPE = 'stripe'           // Stripe
}

@Entity('orders')
@Index(['user_id', 'status', 'created_at'])
@Index(['agent_id', 'created_at'])
@Index(['order_no'], { unique: true })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 32 })
  order_no: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  agent_id: string;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pay_amount: number;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  payment_no: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expired_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    quantity?: number;            // 购买数量（按次）
    duration_months?: number;     // 订阅时长
    coupon_id?: string;          // 优惠券ID
    coupon_code?: string;        // 优惠码
    remark?: string;             // 备注
  };

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Agent, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @OneToMany(() => OrderLog, log => log.order)
  logs: OrderLog[];

  @OneToMany(() => Refund, refund => refund.order)
  refunds: Refund[];
}

@Entity('order_logs')
@Index(['order_id', 'created_at'])
export class OrderLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  order_id: string;

  @Column()
  from_status: string;

  @Column()
  to_status: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'uuid', nullable: true })
  operator_id: string;

  @Column({ nullable: true })
  operator_type: string; // user, system, admin

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Order, order => order.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

@Entity('refunds')
@Index(['order_id'])
@Index(['user_id', 'created_at'])
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 32 })
  refund_no: string;

  @Column('uuid')
  order_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected, completed

  @Column({ type: 'text', nullable: true })
  admin_reply: string;

  @Column({ type: 'uuid', nullable: true })
  admin_id: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Order, order => order.refunds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
