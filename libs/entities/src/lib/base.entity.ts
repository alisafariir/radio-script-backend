import { BeforeInsert, BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity as TypeORMBaseEntity, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestampsOnInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateTimestampsOnUpdate() {
    this.updatedAt = new Date();
  }
}
