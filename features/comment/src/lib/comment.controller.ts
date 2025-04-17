import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() body: { content: string; authorId: string; postId: string }) {
    return this.commentService.create(body.content, body.authorId, body.postId);
  }

  @Get('post/:postId')
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAllByPost(postId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
