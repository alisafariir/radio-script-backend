import { Media } from '@/entities';
import { S3Service } from '@/helpers';
import { UserService } from '@/user';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private userService: UserService,
    private s3Service: S3Service,
    private i18nService: I18nService
  ) {}

  async uploadFile(files: Express.Multer.File[], user_id: string): Promise<Media[]> {
    const user = await this.userService.findOne(user_id);

    if (!user) {
      throw new UnauthorizedException(this.i18nService.t('error.USER_NOT_FOUND'));
    }

    if (!files || files.length === 0) {
      throw new BadRequestException(this.i18nService.t('error.NO_FILE_SELECTED'));
    }

    const uploadedMedia: Media[] = [];

    for (const file of files) {
      const fileUrl = await this.s3Service.uploadFile(file, `uploads/${user.id}`, file.originalname);

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

    const key = media.url.split('/').pop();
    await this.s3Service.deleteFile(key);

    await this.mediaRepository.delete(id);
  }
}
