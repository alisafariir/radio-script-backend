import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, BaseEntity as TypeORMBaseEntity, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({ default: null })
  deleted_at: Date;

  @BeforeInsert()
  updateTimestampsOnInsert() {
    this.created_at = new Date();
    this.created_at = new Date();
  }

  @BeforeUpdate()
  updateTimestampsOnUpdate() {
    this.created_at = new Date();
  }
}
