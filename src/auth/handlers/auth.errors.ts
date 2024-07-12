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
      `Duplication error, User ${error} already exists!`,
    );
  }
  console.log(error);
  throw new InternalServerErrorException(error.message);
}
