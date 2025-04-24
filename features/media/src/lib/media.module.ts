import { Media, User } from '@/entities';
import { JwtAuthGuard, RolesGuard } from '@/guards';
import { S3Service } from '@/helpers';
import { TokenModule } from '@/token';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, User]), TokenModule],
  controllers: [MediaController],
  providers: [MediaService, S3Service, JwtAuthGuard, RolesGuard, JwtService],
  exports: [MediaService],
})
export class MediaModule {}
