export const originalFileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  if (!file) return callback(new Error('No file is empty'), 'error');

  const fileName = `${file.originalname}`;

  callback(null, fileName);
};
