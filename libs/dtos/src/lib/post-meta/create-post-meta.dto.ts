// src/post-meta/dto/create-post-meta.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostMetaDto {
  @IsUUID()
  postId: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsOptional()
  @IsString()
  value?: string;
}
