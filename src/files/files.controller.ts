import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:filename')
  findProductFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = this.filesService.getStaticProductFile(filename);
    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // });

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFiler,
      // limits: { fileSize: 1024 * 1024 },
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    // console.log({ fileInController: file });

    if (!file) {
      throw new BadRequestException('File is empty');
    }

    const secureUrl = `${file.filename}`;

    return { secureUrl };
  }
}
