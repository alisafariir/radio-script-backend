import { NotAcceptableException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { extname } from 'path';
// Define allowed file extensions
const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt', '.rtf', '.html', '.zip', '.mp3', '.wma', '.mpg', '.mkv', '.flv', '.avi', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Multer configuration
export const multerOptions = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new NotAcceptableException('invalid format'), false);
    }
  },
  storage: memoryStorage(),
};

const allowedAvatarExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

export const avatarMulterOptions = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = extname(file.originalname).toLowerCase();
    if (allowedAvatarExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new NotAcceptableException('invalid format'), false);
    }
  },
  storage: memoryStorage(),
};
