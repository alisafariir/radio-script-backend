import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GoogleOneTapDto {
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.REQUIRED', { args: { field: 'CREDENTIAL' } }),
  })
  credential: string;
}
