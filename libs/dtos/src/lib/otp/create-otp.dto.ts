import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateOtpDto {
  @IsPhoneNumber('IR', { message: 'دریافت کننده معتبر نیست' })
  @ApiProperty()
  recipient: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp_expiration: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: string;
}
