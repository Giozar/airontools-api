import path from 'path';
import fs from 'fs';
import getImageBufferUtil from './getImageBuffer.util';

export default async function validateImageUtil(
  image: string,
  entity: string,
  _id: string,
): Promise<string> {
  const fallbackImage = path.join(
    __dirname,
    '../../assets/images/fallback-images/no-image.jpg',
  );
  const unsupportedImage = path.join(
    __dirname,
    '../../assets/images/fallback-images/no-support.jpg',
  );
  const notFoundImage = path.join(
    __dirname,
    '../../assets/images/fallback-images/image-not-found.jpg',
  );

  // Validación si no hay imagen
  if (!image || image.length === 0) {
    return fallbackImage;
  }

  const supportedFormats = ['.png', '.jpg', '.jpeg'];
  const ext = path.extname(image).toLowerCase();

  // Validación de formato soportado
  if (!supportedFormats.includes(ext)) {
    return unsupportedImage;
  }

  // Manejo de imágenes en S3
  if (process.env.STORAGE === 'S3') {
    try {
      const imageBuffer = await getImageBufferUtil(image);
      const imageBase64 = imageBuffer.toString('base64');
      return `data:image/${ext.replace('.', '')};base64,${imageBase64}`;
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      return notFoundImage;
    }
  }

  // Manejo de imágenes almacenadas localmente
  const localImagePath = path.join(
    __dirname,
    `../../assets/uploads/images/${entity}/${_id}/${image.replace(/\S+\/\/\S+\/\w+\//, '')}`,
  );

  // Verificamos si la imagen existe en el sistema de archivos
  if (fs.existsSync(localImagePath)) {
    return localImagePath;
  } else {
    return notFoundImage;
  }
}
