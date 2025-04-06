import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

export class RegisterDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: "ایمیل معتبر نیست" })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber("IR", { message: "شماره موبایل معتبر نیست" })
  phone_number: string;

  @IsNotEmpty({ message: "رمز یکبار‌مصرف الزامی است" })
  @IsString()
  @MinLength(4, { message: "رمز یکبار‌مصرف باید حداقل 4 کاراکتر باشد" })
  otp: string;

  @IsNotEmpty({ message: "رمز عبور الزامی است" })
  @IsString()
  @MinLength(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد" })
  password: string;
}
