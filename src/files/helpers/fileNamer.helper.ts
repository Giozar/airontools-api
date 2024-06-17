export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  //console.log({ file });

  if (!file) return callback(new Error('No file is empty'), 'error');

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `Nuevo.${fileExtension}`;

  callback(null, fileName);
};
