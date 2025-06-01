// app.controller.ts
import * as fs from 'fs';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

  // post methode for works 
  @Post('works')
  @UseInterceptors(
    // 1st arg: field name, 2nd: max number of files, 3rd: multer options
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = 'public/files/works';
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname).toLowerCase();
          cb(null, `${uniqueName}${fileExt}`);
        },
      }),
      fileFilter: (_req, _file, cb) => cb(null, true),
    }),
  )
  uploadWorkFiles(
    @UploadedFiles() files: Express.Multer.File[],           // note UploadedFiles
  ) {
    // return an array of { url } objects
    return files.map(f => ({ url: `/files/works/${f.filename}` }));
  }

  // post methode for gigs 
  @Post('gigs')
  @UseInterceptors(
    // 1st arg: field name, 2nd: max number of files, 3rd: multer options
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = 'public/files/gigs';
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExt = extname(file.originalname).toLowerCase();
          cb(null, `${uniqueName}${fileExt}`);
        },
      }),
      fileFilter: (_req, _file, cb) => cb(null, true),
    }),
  )
  uploadGigsFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files.map(f => ({ url: `/files/gigs/${f.filename}` }));
  }
}
