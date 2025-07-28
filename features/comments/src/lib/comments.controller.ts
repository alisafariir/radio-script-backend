import { CommentQueryDto } from '@/dtos';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from './comments.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() body: { content: string; authorId: string; postId: string }) {
    return this.commentService.create(body.content, body.authorId, body.postId);
  }

  @Get()
  findAll(@Query() query: CommentQueryDto) {
    return this.commentService.findAll(query);
  }

  @Get('post/:postId')
  findAllByPost(@Param('postId') postId: string, @Query() query: CommentQueryDto) {
    return this.commentService.findAllByPost(postId, query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
