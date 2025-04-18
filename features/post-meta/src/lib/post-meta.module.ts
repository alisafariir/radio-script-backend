import { Post, PostMeta } from '@/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMetaController } from './post-meta.controller';
import { PostMetaService } from './post-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostMeta, Post])],
  controllers: [PostMetaController],
  providers: [PostMetaService],
  exports: [PostMetaService],
})
export class PostMetaModule {}
