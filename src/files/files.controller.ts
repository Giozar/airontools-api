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
import * as fs from 'fs';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  // Método para obtener archivos
  @Get(['get-file/:filename', 'get-file/*/:filename'])
  findProductFile(
    @Param('filename') filename: string,
    @Param() params: Record<string, string>,
    @Res() res: Response,
  ) {
    const dynamicPath = Object.values(params)
      .filter((p) => p !== filename)
      .join('/');
    const path = this.filesService.getStaticFile(filename, dynamicPath);
    res.sendFile(path);
  }

  // Método para subir archivos
  @Post(['upload-file', 'upload-file/*'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFiler,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dynamicPath = req.params[0] || ''; // Captura todo lo que está después de 'upload'
          const uploadPath = `./static/uploads/${dynamicPath}`;

          // Asegúrate de que el directorio existe, si no, créalo
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(
    @Param() params: Record<string, string>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is empty');
    }

    const dynamicPath = Object.values(params).join('/');
    const secureUrl = `${this.configService.get('HOST_API')}/files/${dynamicPath}/${file.filename}`;
    return { secureUrl };
  }

  // Método para eliminar archivos
  @Delete(['delete-file/:filename', 'delete-file/*/:filename'])
  deleteFile(
    @Param('filename') filename: string,
    @Param() params: Record<string, string>,
  ) {
    const dynamicPath = Object.values(params)
      .filter((p) => p !== filename)
      .join('/');
    this.filesService.deleteFile(filename, dynamicPath);
    return { message: 'File successfully deleted' };
  }

  @Post(['upload-file-s3', 'upload-file-s3/*'])
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
    @Param() params: Record<string, string>,
  ) {
    // Se extrae la extensión del archivo
    const extension = file.originalname.split('.').pop();
    const fileName = customFileName
      ? `${customFileName}.${extension}`
      : file.originalname;
    const folderPath = Object.values(params).join('/');
    const { res, key } = await this.filesService.uploadFileS3(
      file,
      fileName,
      folderPath,
    );
    const imageUrl = `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/${key}`;

    return { res, imageUrl };
  }

  @Get(['get-file-s3/:filename', 'get-file-s3/*/:filename'])
  async getFileS3(
    @Param('filename') filename: string,
    @Param() params: Record<string, string>,
    @Res() res: Response,
  ) {
    const folderPath = Object.values(params)
      .filter((p) => p !== filename)
      .join('/');
    const fileStream = await this.filesService.getFileS3({
      fileName: filename,
      folderPath,
    });
    fileStream.pipe(res);
  }

  @Get('download-file-s3/:filename')
  async downloadFileS3(@Param('filename') filename: string) {
    try {
      await this.filesService.downloadFileS3(filename);
    } catch (error) {}
  }

  @Delete(['delete-file-s3/:filename', 'delete-file-s3/*/:filename'])
  async deleteFileS3(
    @Param('filename') filename: string,
    @Param() params: Record<string, string>,
  ) {
    const folderPath = Object.values(params)
      .filter((p) => p !== filename)
      .join('/');
    await this.filesService.deleteFileS3(filename, folderPath);
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
