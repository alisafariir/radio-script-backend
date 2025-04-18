// src/post-meta/post-meta.controller.ts
import { CreatePostMetaDto, UpdatePostMetaDto } from '@/dtos';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostMetaService } from './post-meta.service';

@Controller('post-meta')
export class PostMetaController {
  constructor(private readonly metaService: PostMetaService) {}

  @Post()
  create(@Body() dto: CreatePostMetaDto) {
    return this.metaService.create(dto);
  }

  @Get('post/:postId')
  findAll(@Param('postId') postId: string) {
    return this.metaService.findAll(postId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostMetaDto) {
    return this.metaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaService.remove(id);
  }
}
