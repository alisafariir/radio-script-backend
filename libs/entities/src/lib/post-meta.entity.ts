import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('post_meta')
export class PostMeta extends BaseEntity {
  @Column({ name: 'post_id' })
  postId: string;

  @Exclude()
  @ManyToOne(() => Post, (post) => post.meta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  key: string;

  @Column({ type: 'text', nullable: true })
  value?: string;
}
