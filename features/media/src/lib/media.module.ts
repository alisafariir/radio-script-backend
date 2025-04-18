import { Media } from '@/entities';
import { S3Service } from '@/helpers';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, S3Service],
  exports: [MediaService],
})
export class MediaModule {}
