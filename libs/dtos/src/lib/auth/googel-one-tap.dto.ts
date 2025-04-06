import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleOneTapDto {
  @IsString()
  @IsNotEmpty({ message: 'مقدار بلیط امنیتی اجباری است.' })
  credential: string;
}
