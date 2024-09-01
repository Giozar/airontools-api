import { BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

export function validateId(id: Types.ObjectId | string): Types.ObjectId {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`El id ${id} no es un MongoId válido`);
  }

  // Retornar el ID si es válido
  return new mongoose.Types.ObjectId(id);
}
