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
    throw new ConflictException(
      `Error, empleado duplicado ${error.message} el empleado ya existe!`,
    );
  }
  console.log(error);
  throw new InternalServerErrorException(error.message);
}
