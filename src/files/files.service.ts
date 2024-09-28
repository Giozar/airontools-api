import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { AWSConfig } from './interfaces/aws.interface';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  private awsConfig = this.configService.get<AWSConfig>('awsConfig');

  private clientAWS = new S3Client({
    region: this.awsConfig.region,
    credentials: {
      accessKeyId: this.awsConfig.accessKeyId,
      secretAccessKey: this.awsConfig.secretAccessKey,
    },
  });

  // Obtener archivo estático desde una ruta dinámica
  getStaticFile(fileName: string, ...folders: string[]) {
    const path = join(__dirname, '../../static/uploads', ...folders, fileName);

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${fileName}`);
    }
    return path;
  }

  // Eliminar archivo desde una ruta dinámica
  deleteFile(fileUrl: string) {
    const filePath = fileUrl.replace(/https?:\/\/([^\/]+)\//, '');
    const path = join(__dirname, '../../assets/', filePath);

    if (!existsSync(path)) {
      throw new BadRequestException(`No file found with name ${filePath}`);
    }

    try {
      unlinkSync(path);
    } catch (err) {
      throw new BadRequestException(`Failed to delete file: ${err.message}`);
    }
  }

  // Subir archivo a S3 en una carpeta dinámica
  async uploadFileS3(
    @UploadedFile() file: Express.Multer.File,
    fileName: string,
    folderPath?: string, // Nueva ruta de carpetas
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File is empty');
      }

      // Leer el archivo del sistema local
      const stream = fs.createReadStream(this.getStaticFile(file.filename));

      // Configurar el Content-Type según el tipo de archivo
      const contentType = file.mimetype;

      // Construir la clave que incluye la ruta de carpetas
      const key = folderPath ? `${folderPath}/${fileName}` : fileName;

      const uploadParams = {
        Bucket: this.awsConfig.bucketName,
        Key: key, // Aquí se incluye la estructura de carpetas
        Body: stream,
        ContentType: contentType,
      };

      // Subir archivo a S3
      const command = new PutObjectCommand(uploadParams);
      const res = await this.clientAWS.send(command);

      return { res, key };
    } catch (error) {
      throw new BadRequestException(
        'Error uploading file to S3',
        error.message,
      );
    }
  }

  async getFileS3({
    fileName,
    folderPath,
    isEditing,
  }: {
    fileName: string;
    folderPath?: string;
    isEditing?: boolean;
  }): Promise<Readable> | null {
    // Construir la clave que incluye la ruta de carpetas
    const key = folderPath ? `${folderPath}/${fileName}` : fileName;
    const command = new GetObjectCommand({
      Bucket: this.awsConfig.bucketName,
      Key: key,
    });
    try {
      if (!key) {
        return null;
      }
      // console.log('Trying to get file from S3');
      const data = await this.clientAWS.send(command);
      return data.Body as Readable;
    } catch (error) {
      // Manejar error si no se encuentra el archivo
      if (error.name === 'NoSuchKey') {
        if (!isEditing)
          throw new BadRequestException(`No file found with name ${key}`);
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
          Bucket: this.awsConfig.bucketName,
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

  async downloadFileS3(fileName: string, folderPath?: string) {
    const key = folderPath ? `${folderPath}/${fileName}` : fileName;
    const command = new GetObjectCommand({
      Bucket: this.awsConfig.bucketName,
      Key: key,
    });
    try {
      const downloadPath = `./static/downloads/${folderPath}`;
      // Asegúrate de que el directorio existe, si no, créalo
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
      }
      const data = await this.clientAWS.send(command);
      return (data.Body as Readable).pipe(
        fs.createWriteStream(`${downloadPath}/${fileName}`),
      );
    } catch (error) {
      throw new BadRequestException(
        'Error downloading file from S3',
        error.message,
      );
    }
  }

  async deleteFileS3(fileUrl: string) {
    try {
      // Construir la clave que incluye la ruta de carpetas
      const key = fileUrl.replace(/https?:\/\/([^\/]+)\//, '');

      const command = new DeleteObjectCommand({
        Bucket: this.awsConfig.bucketName,
        Key: key, // Aquí se incluye la estructura de carpetas
      });

      return await this.clientAWS.send(command);
    } catch (error) {
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
