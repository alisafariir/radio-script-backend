import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class EncryptionService {
  private readonly secretKey;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('ENCRYPT_SECRET_KEY');

    if (!this.secretKey) {
      throw new Error(
        'ENCRYPT_SECRET_KEY is not defined in the environment variables.'
      );
    }
  }

  async hash(text: string) {
    return argon2.hash(text, { secret: Buffer.from(this.secretKey) });
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return argon2.verify(hash || '', text || '', {
      secret: Buffer.from(this.secretKey),
    });
  }
}
