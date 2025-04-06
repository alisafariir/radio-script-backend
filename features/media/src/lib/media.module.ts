import { Media } from '@/entities';
import { S3Service } from '@/helpers';
import { AppFileInterceptor } from '@/interceptors';
import { UserModule } from '@/user';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Media]), UserModule],
  controllers: [MediaController],
  providers: [MediaService, S3Service, AppFileInterceptor],
  exports: [MediaService],
})
export class MediaModule {}
