import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CommentQueryDto {
  @IsOptional()
  @ApiProperty()
  search?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  authorId?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  postId?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  limit?: number = 10;
}
