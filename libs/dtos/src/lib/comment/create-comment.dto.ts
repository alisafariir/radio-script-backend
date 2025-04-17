// src/comments/dto/create-comment.dto.ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  authorId: string;

  @IsUUID()
  postId: string;
}
