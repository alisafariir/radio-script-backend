import { Tag, User } from '@/entities';
import { TokenModule } from '@/token';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tags.controller';
import { TagService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User]), TokenModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
