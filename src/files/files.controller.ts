import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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

    // Se extrae la extensión del archivo
    const extension = file.originalname.split('.').pop();
    const fileName = customFileName
      ? `${customFileName}.${extension}`
      : file.originalname;

    const res = await this.filesService.uploadFileS3(file, fileName);
    const url = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/${fileName}`;

    return { res, url };
  }

  @Get('get-file-s3/:filename')
  async getFileS3(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const fileStream = await this.filesService.getFileS3(filename);
      fileStream.pipe(res);
    } catch (error) {
      throw new BadRequestException(
        'Error getting file from S3',
        error.message,
      );
    }
  }

  @Get('download-file-s3/:filename')
  async downloadFileS3(@Param('filename') filename: string) {
    try {
      await this.filesService.downloadFileS3(filename);
    } catch (error) {}
  }

  @Delete('delete-file-s3/:filename')
  async deleteFileS3(@Param('filename') filename: string) {
    try {
      await this.filesService.deleteFileS3(filename);
    } catch (error) {
      throw new BadRequestException(
        'Error deleting file from S3',
        error.message,
      );
    }
  }

  @Post('edit-file-s3')
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
  async editFileS3(
    @UploadedFile() file: Express.Multer.File,
    @Body('customFileName') customFileName: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is empty');
    }

    try {
      // Buscamos si el archivo existe en S3
      const extension = file.originalname.split('.').pop();
      const fileName = customFileName
        ? `${customFileName}.${extension}`
        : file.originalname;

      console.log(fileName);
      const fileExists = await this.filesService.getFileS3(fileName);

      // si es el mismo archivo y el mismo nombre no se hace nada
      if (fileExists) {
        // comparamos el buffer del archivo subido con el buffer del archivo en S3
        const fileStream = await this.filesService.getFileS3(fileName);
        const chunks = [];
        fileStream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        fileStream.on('end', () => {
          const bufferS3 = Buffer.concat(chunks);
          console.log(bufferS3);
          // if (buffer.equals(bufferS3)) {
          //   return { message: 'The file is the same' };
          // }
          // return { message: 'The file is different' };
        });
        // verificamos que el archivo sea el mismo
        return { message: 'The file is the same' };
      }
      return { message: 'The file is different' };
    } catch (error) {
      throw new BadRequestException(
        'Error editing file from S3',
        error.message,
      );
    }
  }
}
