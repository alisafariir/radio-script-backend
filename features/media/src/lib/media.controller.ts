import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 }, // حداکثر 20 مگابایت
    })
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
