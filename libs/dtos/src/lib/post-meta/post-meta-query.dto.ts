import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PostMetaQueryDto {
  @IsOptional()
  @ApiProperty()
  search?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  key?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  value?: string;

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
