import { Media } from '@/entities';
import { S3Service } from '@/helpers';
import { UserService } from '@/user';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private userService: UserService,
    private s3Service: S3Service
  ) {}

  async uploadFile(files: Express.Multer.File[], user_id: string): Promise<Media[]> {
    const user = await this.userService.findOne(user_id);

    if (!user) {
      throw new UnauthorizedException('کاربری وجود ندارد');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('فایلی انتخاب نشده است.');
    }

    const uploadedMedia: Media[] = [];

    for (const file of files) {
      const fileUrl = await this.s3Service.uploadFile(file, `uploads/${user.id}`, file.originalname);

      // ذخیره اطلاعات فایل در جدول media
      const media = new Media();
      media.file_name = file.originalname;
      media.url = fileUrl;
      media.user = user;

      await this.mediaRepository.save(media);
      uploadedMedia.push(media);
    }

    return uploadedMedia;
  }

  async getUserMedia(user_id: string): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { user_id },
      relations: ['user'],
    });
  }

  async deleteMedia(id: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });
    if (!media) {
      throw new Error('Media not found');
    }

    // حذف فایل از S3
    const key = media.url.split('/').pop(); // استخراج نام فایل از URL
    await this.s3Service.deleteFile(key);

    // حذف رکورد از جدول media
    await this.mediaRepository.delete(id);
  }
}
