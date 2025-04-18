// src/categories/dto/create-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'category name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'category slug' })
  slug: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  parentId?: string;
}
