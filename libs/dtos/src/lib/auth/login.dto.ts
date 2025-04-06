import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('IR', { message: 'شماره موبایل معتبر نیست' })
  phone_number: string;

  @IsNotEmpty({ message: 'رمز عبور الزامی است' })
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' })
  password = '';
}

export class LoginOtpDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('IR', { message: 'شماره موبایل معتبر نیست' })
  phone_number: string;

  @IsNotEmpty()
  @MinLength(4)
  otp?: string;
}
export class SocialLoginDto {
  email: string;
  first_name: string;
  last_name: string;
  picture: string;
  access_token: string;
}
