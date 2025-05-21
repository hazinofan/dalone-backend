// app.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class AppController {
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => { 
          // ensure the folder exists
          const uploadPath = 'public/avatar';
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          // use a timestamp + random suffix to avoid collisions
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname).toLowerCase();
          cb(null, `${name}${fileExt}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // only allow jpg/png
        if (!file.mimetype.match(/\/(jpe?g|png)$/)) {
          return cb(new BadRequestException('Only JPG/PNG allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // optional: max 5MB
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // returns e.g. { url: '/public/avatar/1623456789-123.png' }
    return { url: `/public/avatar/${file.filename}` };
  }
}
