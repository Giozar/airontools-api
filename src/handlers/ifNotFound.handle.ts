import { NotFoundException } from '@nestjs/common';
import { Document } from 'mongoose';

export function ifNotFound({
  entity,
  id,
}: {
  entity: Document<any>;
  id: string;
}) {
  if (!entity)
    throw new NotFoundException(`No se encontró información sobre el id ${id}`);
}
