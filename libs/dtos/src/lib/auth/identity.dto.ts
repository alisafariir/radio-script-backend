import { IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';

export class IdentityDto {
  @ValidateIf((o) => !o.phone_number)
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('IR', { message: 'validation.INVALID_PHONE_NUMBER' })
  phone_number: string;
}
