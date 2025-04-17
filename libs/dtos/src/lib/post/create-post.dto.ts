// src/posts/dto/create-post.dto.ts
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'scheduled'])
  status?: 'draft' | 'published' | 'scheduled';

  @IsOptional()
  @IsEnum(['post', 'podcast', 'page', 'video'])
  type?: 'post' | 'podcast' | 'page' | 'video';

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsUUID()
  authorId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsUUID()
  featuredImageId?: string;
}
