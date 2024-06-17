import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFiler,
      // limits: { fileSize: 1024 * 1024 },
      storage: diskStorage({
        destination: './static/uploads',
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    // console.log({ fileInController: file });

    if (!file) {
      throw new BadRequestException('File is empty');
    }

    return { fileName: file.originalname };
  }
}
