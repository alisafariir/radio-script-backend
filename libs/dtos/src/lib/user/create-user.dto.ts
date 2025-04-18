import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserByPhoneNumberDto {
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  @ApiProperty()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otpExpireTime: string;
}

export class CreateUserByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otpExpireTime: string;
}
