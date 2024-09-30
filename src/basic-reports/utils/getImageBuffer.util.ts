import * as https from 'https';
import { URL } from 'url';

export default async function getImageBufferUtil(
  imageUrl: string,
): Promise<Buffer> {
  validateHttpsUrl(imageUrl);
  return fetchImageBuffer(imageUrl);
}

/**
 * Valida que la URL proporcionada sea HTTPS.
 * @param {string} imageUrl - URL de la imagen a validar.
 */
function validateHttpsUrl(imageUrl: string): void {
  try {
    const parsedUrl = new URL(imageUrl);
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Unsupported URL protocol. Only HTTPS is supported.');
    }
  } catch (error) {
    throw new Error(`Invalid URL format: ${imageUrl}`);
  }
}

/**
 * Realiza una solicitud HTTPS y retorna el buffer de la imagen.
 * @param {string} imageUrl - URL de la imagen a descargar.
 * @returns {Promise<Buffer>} - Promesa que resuelve el buffer de la imagen.
 */
function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(imageUrl, (response) => {
        const dataChunks: Buffer[] = [];

        if (response.statusCode !== 200) {
          return reject(
            new Error(
              `Failed to fetch image. Status code: ${response.statusCode}`,
            ),
          );
        }

        // Almacena los datos recibidos
        response.on('data', (chunk) => dataChunks.push(chunk));

        // Cuando finalice la respuesta, concatenar los chunks
        response.on('end', () => resolve(Buffer.concat(dataChunks)));

        // Manejar errores durante la recepción de datos
        response.on('error', () =>
          reject(new Error('Error fetching image from the URL')),
        );
      })
      .on('error', () => reject(new Error('Unable to initiate HTTPS request')));
  });
}
