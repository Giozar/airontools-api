import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler } from './helpers/fileFilter.helper';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFiler,
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return { fileName: file.originalname };
  }
}
