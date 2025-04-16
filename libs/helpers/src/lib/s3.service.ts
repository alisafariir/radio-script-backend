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
    } catch (error) {
      this.logger.error(`Error uploading file ${key}`, error);
      throw this.handleS3Error(error);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
    } catch (error) {
      this.logger.error(`Error deleting file ${key}`, error);
      throw this.handleS3Error(error);
    }
  }

  async deleteDirectory(prefix: string): Promise<void> {
    // Ensure prefix ends with '/' for directory behavior
    if (!prefix.endsWith('/')) {
      prefix += '/';
    }

    try {
      let continuationToken: string | undefined;
      let objectsToDelete: { Key: string }[] = [];

      // First check if directory exists
      const listResponse = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          MaxKeys: 1, // We only need to know if at least one object exists
        })
      );

      // If no objects found, directory doesn't exist
      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        this.logger.log(`Directory ${prefix} does not exist`);
        return;
      }

      // If directory exists, proceed with full deletion
      do {
        const listResponse = await this.s3Client.send(
          new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
          })
        );

        if (listResponse.Contents?.length) {
          objectsToDelete = objectsToDelete.concat(listResponse.Contents.map((obj) => ({ Key: obj.Key! }))); // Added missing parenthesis here
        }

        continuationToken = listResponse.NextContinuationToken;
      } while (continuationToken);

      // Delete in batches of 1000 (S3 limit)
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
    } catch (error) {
      if (this.isNoSuchKeyError(error)) {
        this.logger.log(`Directory ${prefix} does not exist`);
        return;
      }
      this.logger.error(`Error deleting directory ${prefix}`, error);
      throw this.handleS3Error(error);
    }
  }

  private isNoSuchKeyError(error: unknown): boolean {
    if (error instanceof Error && 'code' in error) {
      return error.code === 'NoSuchKey' || error.message.includes('NoSuchKey') || error.message.includes('not found');
    }
    return false;
  }

  private handleS3Error(error: unknown): Error {
    if (error instanceof S3ServiceException) {
      // Handle specific S3 errors
      if (error.$response?.body) {
        try {
          const body = error.$response.body.toString();
          if (body.includes('<html>')) {
            return new Error('Received HTML error page instead of API response');
          }
        } catch (e) {
          this.logger.warn('Failed to parse error response body', e);
        }
      }
      return error;
    }
    return error instanceof Error ? error : new Error('Unknown S3 error');
  }
}
