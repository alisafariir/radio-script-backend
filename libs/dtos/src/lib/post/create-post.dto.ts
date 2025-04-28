import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreatePostMetaNestedDto } from '../post-meta/create-post-meta.dto';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  excerpt?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'scheduled'])
  @ApiProperty()
  status?: 'draft' | 'published' | 'scheduled';

  @IsOptional()
  @IsEnum(['post', 'podcast', 'page', 'video'])
  @ApiProperty()
  type?: 'post' | 'podcast' | 'page' | 'video';

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  slug: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty()
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty()
  tagIds?: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  featuredImageId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaNestedDto)
  @ApiProperty()
  meta?: CreatePostMetaNestedDto[];
}
