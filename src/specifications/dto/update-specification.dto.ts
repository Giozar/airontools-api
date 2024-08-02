import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecificationDto } from './create-specification.dto';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateSpecificationDto extends PartialType(
  CreateSpecificationDto,
) {
  @IsNotEmpty({ message: 'El campo updatedBy no puede estar vacío' })
  updatedBy: Types.ObjectId;
}
