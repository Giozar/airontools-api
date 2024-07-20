import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

export function validateId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Id no válido');
  }
}
