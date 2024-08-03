import { BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

export function validateId(id: Types.ObjectId | string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Id no válido');
  }
}
