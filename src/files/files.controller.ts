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
import { fileFiler, fileNamer, originalFileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/:filename')
  findProductFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = this.filesService.getStaticFile(filename);
    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // });

    res.sendFile(path);
  }

  @Post('upload')
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

    const secureUrl = `${this.configService.get('HOST_API')}/files/${file.filename}`;

    return { secureUrl };
  }

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
    // Se extrae la extensión del archivo
    const extension = file.originalname.split('.').pop();
    const fileName = customFileName
      ? `${customFileName}.${extension}`
      : file.originalname;

    const { res, key } = await this.filesService.uploadFileS3(file, fileName);
    const imageUrl = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/${key}`;

    return { res, imageUrl };
  }

  @Get('get-file-s3/:filename')
  async getFileS3(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = await this.filesService.getFileS3({
      fileName: filename,
    });
    fileStream.pipe(res);
  }

  @Get('download-file-s3/:filename')
  async downloadFileS3(@Param('filename') filename: string) {
    try {
      await this.filesService.downloadFileS3(filename);
    } catch (error) {}
  }

  @Delete('delete-file-s3/:filename')
  async deleteFileS3(@Param('filename') filename: string) {
    await this.filesService.deleteFileS3(filename);
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
    try {
      const { res, fileName } = await this.filesService.editFileS3(
        file,
        customFileName,
        uploadedFileName,
      );
      const imageUrl = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/${fileName}`;

      return { res, imageUrl };
    } catch (error) {
      // console.log('Si hay error', error.response);
      return error.response;
    }
  }
}
