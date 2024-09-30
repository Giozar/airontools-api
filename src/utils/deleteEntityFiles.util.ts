export default async function deleteEntityFilesUtil(
  entities: any,
  manuals?: boolean,
) {
  if (entities.length > 0) {
    if (process.env.STORAGE === 'S3') {
      await Promise.all(
        entities.map((entity) => {
          if (entity && entity.images.length > 0) {
            entity.images.map((image) => this.filesService.deleteFileS3(image));
          }
          if (manuals) {
            if (entity && entity.manuals.length > 0) {
              entity.manuals.map((manual) =>
                this.filesService.deleteFileS3(manual),
              );
            }
          }
        }),
      );
    }
  } else {
    await Promise.all(
      entities.map((entity) => {
        if (entity && entity.images.length > 0) {
          entity.images.map((image) => this.filesService.deleteFile(image));
        }
        if (manuals) {
          if (entity && entity.manuals.length > 0) {
            entity.manuals.map((manual) =>
              this.filesService.deleteFile(manual),
            );
          }
        }
      }),
    );
  }
}
