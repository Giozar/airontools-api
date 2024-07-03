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
import { fileFiler, originalFileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload-file-s3')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFiler,
      // limits: { fileSize: 1024 * 1024 },
      storage: diskStorage({
        destination: './static/uploads',
        filename: originalFileNamer,
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
        filename: originalFileNamer,
      }),
    }),
  )
  async editFileS3(
    @UploadedFile() file: Express.Multer.File,
    @Body('customFileName') customFileName: string,
    @Body('uploadedFileName') uploadedFileName: string,
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
      // console.log(fileName);
      // console.log(uploadedFileName);
      const path = this.filesService.getStaticFile(file.originalname);
      const buffer = fs.readFileSync(path);
      // console.log(buffer);
      const fileExists = await this.filesService.getFileS3(uploadedFileName);

      // si es el mismo archivo y el mismo nombre no se hace nada
      if (fileExists) {
        const chunks = [];
        fileExists.on('data', (chunk) => {
          chunks.push(chunk);
        });
        fileExists.on('end', () => {
          const bufferS3 = Buffer.concat(chunks);
          // console.log(bufferS3);

          // comparamos los buffers
          if (buffer.equals(bufferS3)) {
            console.log({ message: 'The file is the same' });
            // Si el nombre del archivo s3 es diferente al nombre del archivo a cargar
            if (uploadedFileName !== fileName) {
              // Se renombra el archivo s3
              return console.log('Cambiamos el nombre del archivo en s3');
            }
            return console.log('No se hace nada');
          } else {
            console.log({ message: 'The file is different' });
            // Si el archivo s3 tiene el mismo nombre que el archivo a cargar
            if (uploadedFileName === fileName) {
              // Se sobreescribe el archivo s3
              return console.log('Sobreescribimos el archivo en s3');
            }
            // Si el archivo s3 tiene un nombre diferente al archivo a cargar
            return console.log('Subimos el nuevo archivo a s3');
          }
        });
      }
    } catch (error) {
      throw new BadRequestException(
        'Error editing file from S3',
        error.message,
      );
    }
  }
}
