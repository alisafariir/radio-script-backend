import { IsEmail, IsPhoneNumber, ValidateIf } from "class-validator";

export class OtpDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: "ایمیل معتبر نیست" })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber("IR", { message: "شماره موبایل معتبر نیست" })
  phone_number: string;
}
