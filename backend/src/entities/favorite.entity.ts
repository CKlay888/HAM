import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';

@Entity('favorite_groups')
@Index(['user_id', 'sort_order'])
export class FavoriteGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ default: false })
  is_public: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: 0 })
  item_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity('favorites')
@Unique(['user_id', 'agent_id'])
@Index(['user_id', 'created_at'])
@Index(['group_id'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  agent_id: string;

  @Column({ type: 'uuid', nullable: true })
  group_id: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @ManyToOne(() => FavoriteGroup, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'group_id' })
  group: FavoriteGroup;
}
