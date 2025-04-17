import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { PostMeta } from './post-meta.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  excerpt?: string;

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'scheduled';

  @Column({ default: 'post' })
  type: 'post' | 'podcast' | 'page' | 'video';

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn({ name: 'featured_image_id' })
  featuredImage?: Media;

  @Column({ name: 'featured_image_id', nullable: true })
  featuredImageId?: string;

  @ManyToMany(() => Category, (category) => category.posts, { eager: true })
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => PostMeta, (meta) => meta.post, { cascade: true, eager: true })
  meta: PostMeta[];
}
