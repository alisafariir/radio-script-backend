// src/media/media.entity.ts
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('media')
export class Media extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  altText?: string;

  @Column({ nullable: true })
  caption?: string;

  @Column({ nullable: true })
  size?: number;

  @ManyToOne(() => User, (user) => user.media, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: string;
}
