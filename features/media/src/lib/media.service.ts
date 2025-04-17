import { Media } from '@/entities';
import { S3Service } from '@/helpers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import 'multer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly uploadFolder = 'media';

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly s3Service: S3Service
  ) {}

  async upload(file: Express.Multer.File): Promise<Media> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const key = `${this.uploadFolder}/${fileName}`;
    // این متد آدرس کامل (URL) را برمی‌گرداند
    const url = await this.s3Service.uploadFile(file, this.uploadFolder, fileName);

    const media = this.mediaRepo.create({
      filename: key, //‌ این کلید برای حذف بعدی مورد استفاده است
      mimetype: file.mimetype,
      size: file.size,
      url,
    });

    return this.mediaRepo.save(media);
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepo.find();
  }

  async remove(id: string): Promise<Media> {
    const media = await this.mediaRepo.findOneBy({ id });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    await this.s3Service.deleteFile(media.filename);

    return this.mediaRepo.remove(media);
  }
}
