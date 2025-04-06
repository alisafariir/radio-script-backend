import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getData(): { message: string } {
    return { message: `The ${this.configService.get<string>('APP_NAME')} say hello. 👋` };
  }
}
