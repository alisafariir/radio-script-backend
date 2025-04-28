import { Category, Media, Post, PostMeta, Tag, User } from '@/entities';
import { TokenModule } from '@/token';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMeta, Tag, Category, Media, User]), TokenModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
