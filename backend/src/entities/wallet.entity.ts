import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, OneToOne, JoinColumn, OneToMany 
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  frozen_balance: number; // 托管中的资金

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_deposited: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_spent: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_earned: number; // 作为 Agent 创建者获得的收入

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  total_withdrawn: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 关联
  @OneToOne(() => User, user => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  // 可用余额 = 总余额 - 冻结余额
  get available_balance(): number {
    return Number(this.balance) - Number(this.frozen_balance);
  }
}
