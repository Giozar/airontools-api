import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleDBErrors(error: any): never {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }

  if (error.code === 11000) {
    throw new ConflictException(`Error de duplicación ${error} ya existe,`);
  }
  if (error?.response?.statusCode === 400)
    throw new InternalServerErrorException(error.response);

  if (error?.response?.statusCode === 404)
    throw new InternalServerErrorException(error.response);

  console.error(error);
  throw new InternalServerErrorException({
    message: 'Ocurrió un problema interno de servidor',
    error: error,
    statusCode: 500,
  });
}
