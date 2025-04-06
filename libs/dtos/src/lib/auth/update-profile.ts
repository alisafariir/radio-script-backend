import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

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
