// src/categories/category.entity.ts
import { Column, Entity, ManyToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('categories')
@Tree('closure-table')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent?: Category;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
