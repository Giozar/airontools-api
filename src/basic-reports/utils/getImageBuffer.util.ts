import * as https from 'https';
export default async function getImageBufferUtil(
  imageUrl: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}
