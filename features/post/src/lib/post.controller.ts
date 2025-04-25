// src/posts/post.controller.ts
import { Roles } from '@/decorators';
import { CreatePostDto, PostQueryDto, UpdatePostDto } from '@/dtos';
import { UserRole } from '@/enums';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { Body, Controller, Delete, Get, Post as HttpPost, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  create(@Req() req: Request, @Body() dto: CreatePostDto) {
    return this.postService.create(req, dto);
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
