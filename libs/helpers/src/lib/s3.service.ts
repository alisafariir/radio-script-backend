// src/s3/s3.service.ts
import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client, S3ServiceException } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'multer';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly endpoint: string;

  constructor(configService: ConfigService) {
    this.endpoint = configService.getOrThrow<string>('S3_ENDPOINT');
    this.bucketName = configService.getOrThrow<string>('S3_BUCKET_NAME');

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
      tls: this.endpoint.startsWith('https://'),
      retryMode: 'standard',
      maxAttempts: 3,
    });
  }

  async uploadFile(file: Express.Multer.File, filePath: string, fileName: string): Promise<string> {
    const key = `${filePath}/${fileName}`;
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return `${this.endpoint}/${this.bucketName}/${key}`;
    } catch (err) {
      this.logger.error(`Error uploading file ${key}`, err as any);
      throw this.handleS3Error(err);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
    } catch (err) {
      this.logger.error(`Error deleting file ${key}`, err as any);
      throw this.handleS3Error(err);
    }
  }

  async deleteDirectory(prefix: string): Promise<void> {
    if (!prefix.endsWith('/')) {
      prefix += '/';
    }

    try {
      // First, check existence
      const checkList = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          MaxKeys: 1,
        })
      );
      if (!checkList.Contents || checkList.Contents.length === 0) {
        this.logger.log(`Directory ${prefix} does not exist`);
        return;
      }

      // Gather all keys
      let continuationToken: string | undefined = undefined;
      const objectsToDelete: { Key: string }[] = [];

      do {
        const listResponse = await this.s3Client.send(
          new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          })
        );

        if (listResponse.Contents?.length) {
          for (const obj of listResponse.Contents) {
            if (obj.Key) {
              objectsToDelete.push({ Key: obj.Key });
            }
          }
        }
        continuationToken = listResponse.NextContinuationToken;
      } while (continuationToken);

      // Batch delete (1000 max per request)
      for (let i = 0; i < objectsToDelete.length; i += 1000) {
        const batch = objectsToDelete.slice(i, i + 1000);
        await this.s3Client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: { Objects: batch },
          })
        );
      }

      this.logger.log(`Deleted ${objectsToDelete.length} objects from ${prefix}`);
    } catch (err) {
      if (this.isNoSuchKeyError(err)) {
        this.logger.log(`Directory ${prefix} does not exist`);
        return;
      }
      this.logger.error(`Error deleting directory ${prefix}`, err as any);
      throw this.handleS3Error(err);
    }
  }

  private isNoSuchKeyError(err: unknown): boolean {
    if (err instanceof Error && 'code' in err) {
      const code = (err as any).code as string;
      return code === 'NoSuchKey' || err.message.includes('NoSuchKey') || err.message.includes('not found');
    }
    return false;
  }

  private handleS3Error(err: unknown): Error {
    if (err instanceof S3ServiceException) {
      try {
        const body = err.$response?.body?.toString();
        if (body?.includes('<html>')) {
          return new Error('Received HTML error page instead of API response');
        }
      } catch {
        this.logger.warn('Failed to parse S3 error response body');
      }
      return err;
    }
    return err instanceof Error ? err : new Error('Unknown S3 error');
  }
}
