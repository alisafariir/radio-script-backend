import { Post, PostMeta, User } from '@/entities';
import { TokenModule } from '@/token';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMetaController } from './post-meta.controller';
import { PostMetaService } from './post-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostMeta, Post, User]), TokenModule],
  controllers: [PostMetaController],
  providers: [PostMetaService],
  exports: [PostMetaService],
})
export class PostMetaModule {}
