import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import awsConfig from '@config/awsConfig';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
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

  getStaticFile(fileName: string) {
    const path = join(__dirname, '../../static/uploads', fileName);

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${fileName}`);
    }
    return path;
  }

  async uploadFileS3(
    @UploadedFile() file: Express.Multer.File,
    fileName: string,
  ) {
    try {
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
      return await this.clientAWS.send(command);
    } catch (error) {
      // console.error(error);
      throw new BadRequestException(
        'Error uploading file to S3',
        error.message,
      );
    }
  }

  async getFileS3(fileName: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: awsConfig().aws.bucketName,
      Key: fileName,
    });
    try {
      const data = await this.clientAWS.send(command);
      return data.Body as Readable;
    } catch (error) {
      // console.error(error);
      throw new Error(`Error getting file: ${error.message}`);
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
}
