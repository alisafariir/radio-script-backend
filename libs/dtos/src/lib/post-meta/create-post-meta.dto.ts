import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostMetaDto {
  @IsUUID()
  @ApiProperty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  key: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  value?: string;
}
