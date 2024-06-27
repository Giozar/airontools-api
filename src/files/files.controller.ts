import {
  BadRequestException,
  Body,
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
import { ConfigService } from '@nestjs/config';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

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

    // const secureUrl = `${file.filename}`;

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }

  @Post('upload-file-s3')
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
  async uploadFileS3(
    @UploadedFile() file: Express.Multer.File,
    @Body('customFileName') customFileName: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is empty');
    }
    const fileName = customFileName || file.originalname;

    const res = await this.filesService.uploadFileS3(file, fileName);
    const url = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/${fileName}`;

    return { res, url };
  }
}
