import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

import { UserRole } from '@/enums';
import { BaseEntity } from './base.entity';
import { Media } from './media.entity';
import { Token } from './token.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  phone_number: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ default: 'system' })
  created_by: 'email' | 'phone_number' | 'social_login' | 'admin' | 'system';

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
    default: UserRole.USER, // Default role is 'user'
  })
  role: UserRole;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Media, (media) => media.user) // رابطه با فایل‌های رسانه
  media: Media[];

  @Column({ nullable: true, default: false })
  blocked: boolean;

  @Column({ nullable: true })
  block_reason: string;

  @CreateDateColumn()
  last_login: Date;
}
