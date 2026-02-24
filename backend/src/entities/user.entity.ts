import { 
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
  UpdateDateColumn, OneToOne, OneToMany 
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Agent } from './agent.entity';
import { Execution } from './execution.entity';
import { Bounty } from './bounty.entity';

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_login_at: Date;

  // 关联
  @OneToOne(() => Wallet, wallet => wallet.user)
  wallet: Wallet;

  @OneToMany(() => Agent, agent => agent.creator)
  created_agents: Agent[];

  @OneToMany(() => Execution, execution => execution.user)
  executions: Execution[];

  @OneToMany(() => Bounty, bounty => bounty.poster)
  posted_bounties: Bounty[];
}
