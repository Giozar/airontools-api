import { PartialType } from '@nestjs/mapped-types';
import { CreateOtherProductDto } from './create-other-product.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateOtherProductDto extends PartialType(CreateOtherProductDto) {
  @IsNotEmpty({ message: 'El campo updatedBy no puede estar vacío' })
  @IsMongoId()
  @IsString()
  updatedBy: Types.ObjectId;
}
