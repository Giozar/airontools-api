export const fileFiler = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  console.log({ file });
  callback(null, true);
};
