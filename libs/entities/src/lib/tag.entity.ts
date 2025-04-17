import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
