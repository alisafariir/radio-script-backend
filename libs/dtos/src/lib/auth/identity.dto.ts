import { IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';

export class IdentityDto {
  @ValidateIf((o) => !o.phone_number, { message: 'Either email or phone number must be provided' })
  @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
  email: string;

  @ValidateIf((o) => !o.email, { message: 'Either email or phone number must be provided' })
  @IsPhoneNumber('IR', { message: 'validation.INVALID_PHONE_NUMBER' })
  phone_number: string;
}
