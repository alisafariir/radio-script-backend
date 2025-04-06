import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserByPhoneNumberDto {
  @IsPhoneNumber("IR")
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  otp: string;

  @IsNotEmpty()
  @IsString()
  otpExpireTime: string;
}

export class CreateUserByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  otp: string;

  @IsNotEmpty()
  @IsString()
  otpExpireTime: string;
}
