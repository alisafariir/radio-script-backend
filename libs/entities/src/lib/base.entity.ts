import { BeforeInsert, BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity as TypeORMBaseEntity, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at: Date;

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
