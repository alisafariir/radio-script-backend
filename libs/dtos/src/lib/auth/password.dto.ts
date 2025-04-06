import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
  ValidateIf,
} from "class-validator";

export class ForgotPasswordDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: "ایمیل معتبر نیست" })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber("IR", { message: "شماره موبایل معتبر نیست" })
  phone_number: string;
}

export class ChangePasswordDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: "ایمیل معتبر نیست" })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber("IR", { message: "شماره موبایل معتبر نیست" })
  phone_number: string;

  @IsNotEmpty({ message: "کلمه‌عبور نباید خالی باشد" })
  @MinLength(6, { message: "کلمه‌عبور باید حداقل 6 کاراکتر داشته باشد" })
  password?: string;

  @IsNotEmpty({ message: "کد یک بار‌مصرف نباید خالی باشد" })
  @MinLength(4, { message: "کد یک بار‌مصرف باید حداقل 4 کاراکتر داشته باشد" })
  otp?: string;
}
