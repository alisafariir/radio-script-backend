import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber('IR')
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsString()
  @MaxLength(512, {
    message: 'تعداد کاراکتر های بایو نباید بیش از 256 کاراکتر باشد',
  })
  @IsOptional()
  bio: string;
}

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  otp: string;
}

export class UpdatePhoneNumberDto {
  @IsPhoneNumber('IR')
  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  otp: string;
}
