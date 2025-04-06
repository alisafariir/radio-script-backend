import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateOtpDto {
  @IsPhoneNumber('IR', { message: 'دریافت کننده معتبر نیست' })
  recipient: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  otp: string;

  @IsNotEmpty()
  @IsString()
  otp_expiration: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
