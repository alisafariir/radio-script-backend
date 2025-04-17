// src/posts/dto/post-query.dto.ts
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'scheduled'])
  status?: 'draft' | 'published' | 'scheduled';

  @IsOptional()
  @IsEnum(['post', 'podcast', 'page', 'video'])
  type?: 'post' | 'podcast' | 'page' | 'video';

  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
