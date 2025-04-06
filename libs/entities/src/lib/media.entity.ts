import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Media extends BaseEntity {
  @Column()
  file_name: string; // نام فایل

  @Column()
  url: string; // آدرس فایل در S3

  @ManyToOne(() => User, (user) => user.media) // رابطه با کاربر
  user: User;

  @Column()
  user_id: string; // شناسه کاربر آپلودکننده
}
