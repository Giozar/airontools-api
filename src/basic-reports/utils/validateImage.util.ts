import path from 'path';
import getImageBufferUtil from './getImageBuffer.util';

export default async function validateImageUtil(
  image: string,
  _id,
): Promise<string> {
  const fallbackImage = path.join(
    __dirname,
    '../../assets/images/fallback-images/no-image.jpg',
  );
  const unsupportedImage = path.join(
    __dirname,
    '../../assets/images/fallback-images/no-support.jpg',
  );

  if (!image || image.length === 0) {
    // No hay imagen disponible, devolvemos la imagen por defecto
    return fallbackImage;
  }

  const supportedFormats = ['.png', '.jpg', '.jpeg'];

  // Verificamos si la imagen está en un formato soportado
  const ext = path.extname(image).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    // Formato no soportado, devolvemos la imagen de "no soportado"
    return unsupportedImage;
  }

  // Si estamos usando S3
  if (process.env.STORAGE === 'S3') {
    try {
      const imageBuffer = await getImageBufferUtil(image);
      const imageBase64 = imageBuffer.toString('base64');
      return `data:image/${ext.replace('.', '')};base64,${imageBase64}`;
    } catch (error) {
      // Si falla obtener la imagen de S3, devolvemos la imagen por defecto
      console.error('Error fetching image from S3:', error);
      return fallbackImage;
    }
  }

  // Si la imagen está almacenada localmente
  return path.join(
    __dirname,
    `../../assets/uploads/images/products/${_id}/${image.replace(/\S+\/\/\S+\/\w+\//, '')}`,
  );
}
