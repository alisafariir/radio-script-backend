import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import multer from 'multer';
import { Observable } from 'rxjs';

@Injectable()
export class AppFileInterceptor implements NestInterceptor {
  private readonly multerInstance;

  constructor() {
    this.multerInstance = multer({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
      fileFilter: (req, file, cb) => {
        console.log(file);

        const allowedExtensions = [
          '.pdf',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
          '.csv',
          '.txt',
          '.rtf',
          '.html',
          '.zip',
          '.mp3',
          '.wma',
          '.mpg',
          '.mkv',
          '.flv',
          '.avi',
          '.jpg',
          '.jpeg',
          '.png',
          '.gif',
          '.webp',
        ];

        const fileExtension = file.originalname.toLowerCase().match(/\.[0-9a-z]+$/i)?.[0];

        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          cb(null, true); // Accept the file
        } else {
          cb(null, false); // Reject the file
        }
      },
    }).array('file', 10); // Accept up to 10 files under the 'file' field
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return new Observable((observer) => {
      this.multerInstance(request, response, (err) => {
        if (err) {
          observer.error(new BadRequestException(err.message));
        } else if (!request.files || request.files.length === 0) {
          observer.error(new BadRequestException('No files uploaded'));
        } else {
          // Attach files to the request object
          request.uploadedFiles = request.files;
          observer.next(request.files); // Pass the array of files to the controller
          observer.complete();
        }
      });
    }).pipe(() => next.handle()); // Ensure the controller is called
  }
}
