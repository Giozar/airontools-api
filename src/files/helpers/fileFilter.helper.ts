export const fileFiler = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  //console.log({ file });

  if (!file) return callback(new Error('No file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  // callback(new Error('File is not a image'), false);
  callback(null, true);
};
