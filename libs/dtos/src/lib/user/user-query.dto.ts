import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsString, Min } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @ApiProperty()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  last_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  picture?: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  phone_number?: string;

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
