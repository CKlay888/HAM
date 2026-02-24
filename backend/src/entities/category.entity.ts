import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: 0 })
  agent_count: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 自引用关联 - 父分类
  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  // 子分类
  @OneToMany(() => Category, category => category.parent)
  children: Category[];
}
