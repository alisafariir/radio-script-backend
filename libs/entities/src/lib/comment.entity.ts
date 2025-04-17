import { BaseEntity } from './base.entity';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';
@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ default: 'pending' })
  status: 'approved' | 'pending' | 'spam';
}
