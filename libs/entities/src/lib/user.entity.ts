import { Column, CreateDateColumn, Entity, Index, OneToMany } from 'typeorm';

import { UserRole } from '@/enums';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { Post } from './post.entity';
import { Token } from './token.entity';

@Entity()
@Index(['email'], { where: 'deleted_at IS NULL' }) // Partial index for email
@Index(['phone_number'], { where: 'deleted_at IS NULL' }) // Partial index for phone
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  phone_number: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Exclude()
  @Column({ default: 'system' })
  created_by: 'email' | 'phone_number' | 'social_login' | 'admin' | 'system';

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true, length: 500 })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Exclude()
  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @Exclude()
  @OneToMany(() => Media, (media) => media.author)
  media: Media[];

  @Exclude()
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Column({ nullable: true, default: false })
  blocked: boolean;

  @Column({ nullable: true })
  block_reason: string;

  @Exclude()
  @CreateDateColumn()
  last_login: Date;
}
