import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  altText?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  caption?: string;
}
