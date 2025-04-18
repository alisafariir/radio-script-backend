// src/comments/dto/create-comment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsUUID()
  @ApiProperty()
  authorId: string;

  @IsUUID()
  @ApiProperty()
  postId: string;
}
