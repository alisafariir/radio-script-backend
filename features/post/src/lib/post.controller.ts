// src/posts/post.controller.ts
import { CreatePostDto, PostQueryDto, UpdatePostDto } from '@/dtos';
import { Body, Controller, Delete, Get, Post as HttpPost, Param, Patch, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
