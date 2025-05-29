import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CategoryQueryDto {
  @IsOptional()
  @ApiProperty()
  search?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  name?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  slug?: string;

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
