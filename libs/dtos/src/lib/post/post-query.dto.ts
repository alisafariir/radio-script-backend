import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  @ApiProperty()
  search?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(['draft', 'published', 'scheduled'])
  status?: 'draft' | 'published' | 'scheduled';

  @IsOptional()
  @IsEnum(['post', 'podcast', 'page', 'video'])
  @ApiProperty()
  type?: 'post' | 'podcast' | 'page' | 'video';

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  category?: string;

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
