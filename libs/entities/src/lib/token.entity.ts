// libs/entities/src/lib/token.entity.ts
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Token extends BaseEntity {
  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  access_token_expiration: Date;

  @Column()
  refresh_token_expiration: Date;

  // اطلاعات دستگاه
  @Column({ nullable: true })
  device_type: string; // مثلاً: mobile, desktop, tablet

  @Column({ nullable: true })
  os: string; // مثلاً: Windows, iOS, Android

  @Column({ nullable: true })
  browser: string; // مثلاً: Chrome, Firefox, Safari

  @Column({ nullable: true })
  ip_address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_accessed: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
