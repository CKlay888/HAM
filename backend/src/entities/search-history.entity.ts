import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index
} from 'typeorm';
import { User } from './user.entity';

@Entity('search_histories')
@Index(['user_id', 'created_at'])
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  keyword: string;

  @Column({ type: 'jsonb', nullable: true })
  filters: {
    category_id?: string;
    price_min?: number;
    price_max?: number;
    rating_min?: number;
    tags?: string[];
  };

  @Column({ default: 0 })
  result_count: number;

  @Column({ nullable: true })
  clicked_agent_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity('hot_searches')
export class HotSearch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  keyword: string;

  @Column({ default: 0 })
  search_count: number;

  @Column({ default: 0 })
  click_count: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_promoted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp' })
  last_searched_at: Date;
}
