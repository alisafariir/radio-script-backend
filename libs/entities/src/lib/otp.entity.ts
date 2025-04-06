import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Otp extends BaseEntity {
  @Column({ unique: true })
  recipient: string;

  @Column()
  type: string;

  @Column()
  otp: string;

  @Column()
  otp_expiration: string;
}
