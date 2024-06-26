import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import awsConfig from '@config/awsConfig';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private clientAWS = new S3Client({
    region: awsConfig().aws.region,
    credentials: {
      accessKeyId: awsConfig().aws.accessKeyId,
      secretAccessKey: awsConfig().aws.secretAccessKey,
    },
  });

  getStaticProductFile(fileName: string) {
    const path = join(__dirname, '../../static/uploads', fileName);

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${fileName}`);
    }
    return path;
  }

  async uploadS3(@UploadedFile() file: Express.Multer.File) {
    try {
      // Implementar lógica para subir archivo a S3
      const stream = fs.createReadStream(
        this.getStaticProductFile(file.filename),
      );

      // Configurar el Content-Type según el tipo de archivo
      const contentType = file.mimetype;

      const uploadParams = {
        Bucket: awsConfig().aws.bucketName,
        Key: file.filename,
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
}
