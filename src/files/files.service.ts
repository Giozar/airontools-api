import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import awsConfig from '@config/awsConfig';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private clientAWS = new S3Client({
    region: awsConfig().aws.region,
    credentials: {
      accessKeyId: awsConfig().aws.accessKeyId,
      secretAccessKey: awsConfig().aws.secretAccessKey,
    },
  });

  getStaticFile(fileName: string, type?: string, id?: string) {
    const path = join(
      __dirname,
      `../../static/uploads/${type ? type + '/' : ''}/${id ? id + '/' : ''}`,
      fileName,
    );

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${fileName}`);
    }
    return path;
  }

  deleteFile(filename: string, type?: string, id?: string) {
    const path = join(
      __dirname,
      `../../static/uploads/${type ? type + '/' : ''}/${id ? id + '/' : ''}`,
      filename,
    );

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${filename}`);
    }

    try {
      unlinkSync(path);
    } catch (err) {
      throw new BadRequestException(`Failed to delete file: ${err.message}`);
    }
  }

  async uploadFileS3(
    @UploadedFile() file: Express.Multer.File,
    fileName: string,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File is empty');
      }
      // Implementar lógica para subir archivo a S3
      const stream = fs.createReadStream(this.getStaticFile(file.filename));

      // Configurar el Content-Type según el tipo de archivo
      const contentType = file.mimetype;

      const key = fileName || file.originalname;

      const uploadParams = {
        Bucket: awsConfig().aws.bucketName,
        Key: key,
        Body: stream,
        ContentType: contentType,
      };

      // Subir archivo a S3
      const command = new PutObjectCommand(uploadParams);
      const res = await this.clientAWS.send(command);
      return { res, key };
    } catch (error) {
      // console.error(error);
      throw new BadRequestException(
        'Error uploading file to S3',
        error.message,
      );
    }
  }

  async getFileS3({
    fileName,
    isEditing,
  }: {
    fileName: string;
    isEditing?: boolean;
  }): Promise<Readable> | null {
    const command = new GetObjectCommand({
      Bucket: awsConfig().aws.bucketName,
      Key: fileName,
    });
    try {
      if (!fileName) {
        return null;
      }
      // console.log('Trying to get file from S3');
      const data = await this.clientAWS.send(command);
      return data.Body as Readable;
    } catch (error) {
      // Manejar error si no se encuentra el archivo
      if (error.name === 'NoSuchKey') {
        if (!isEditing)
          throw new BadRequestException(`No file found with name ${fileName}`);
        return null;
      }

      throw new BadRequestException(
        'Error getting file from S3',
        error.message,
      );
    }
  }

  async updateFileS3(fileName: string, newFileName: string) {
    try {
      const fileStream = await this.getFileS3({ fileName });
      // Subir el archivo con el nuevo nombre utilizando Upload
      const upload = new Upload({
        client: this.clientAWS,
        params: {
          Bucket: awsConfig().aws.bucketName,
          Key: newFileName,
          Body: fileStream,
        },
      });
      // Esperar a que se complete la subida
      const res = await upload.done();
      // Eliminar el archivo con el nombre anterior
      await this.deleteFileS3(fileName);
      // console.log({ message: 'File name updated successfully' });
      return res;
    } catch (error) {
      // console.error(error);
      throw new Error(`Error update file name: ${error.message}`);
    }
  }

  async downloadFileS3(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: awsConfig().aws.bucketName,
      Key: fileName,
    });
    try {
      const data = await this.clientAWS.send(command);
      return (data.Body as Readable).pipe(
        fs.createWriteStream(`./static/downloads/${fileName}`),
      );
    } catch (error) {}
  }

  async deleteFileS3(fileName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: awsConfig().aws.bucketName,
        Key: fileName,
      });
      return await this.clientAWS.send(command);
    } catch (error) {
      // console.error(error);
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  async editFileS3(
    file: Express.Multer.File,
    customFileName: string,
    uploadedFileName: string,
  ): Promise<{ res: any; fileName: string }> {
    if (!file) {
      throw new BadRequestException('File is empty');
    }

    try {
      // Extraer la extensión del archivo
      const extension = file.originalname.split('.').pop();
      const fileName = customFileName
        ? `${customFileName}.${extension}`
        : file.originalname;

      const path = this.getStaticFile(file.originalname);
      const buffer = fs.readFileSync(path);

      // Verificar si el archivo ya existe en S3
      const fileExists = await this.getFileS3({
        fileName: uploadedFileName,
        isEditing: true,
      });

      if (fileExists) {
        const bufferS3 = await this.getFileBuffer(fileExists);

        // Si el archivo a cargar es igual al archivo en S3
        if (buffer.equals(bufferS3)) {
          // Si el nombre del archivo S3 es diferente al nombre del archivo a cargar
          if (uploadedFileName !== fileName) {
            const res = await this.updateFileS3(uploadedFileName, fileName);
            return { res, fileName };
          }
          return { res: 'The file is the same', fileName };
        } else {
          // Si el archivo S3 tiene el mismo nombre que el archivo a cargar
          if (uploadedFileName === fileName) {
            const res = await this.uploadFileS3(file, fileName);
            await this.deleteFileS3(uploadedFileName);
            return { res, fileName };
          }
          // Si el archivo S3 tiene un nombre diferente al archivo a cargar
          const res = await this.uploadFileS3(file, fileName);
          await this.deleteFileS3(uploadedFileName);
          return { res, fileName };
        }
      } else {
        // Subir el archivo a S3 si no existe
        const res = await this.uploadFileS3(file, fileName);
        return { res, fileName };
      }
    } catch (error) {
      throw new BadRequestException(error.message, 'Error editing file');
    }
  }

  // Función auxiliar para obtener el buffer del archivo desde el stream
  private async getFileBuffer(fileStream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      fileStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      fileStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      fileStream.on('error', reject);
    });
  }
}
