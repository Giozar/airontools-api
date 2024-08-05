import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @IsNotEmpty({ message: 'El campo updatedBy no puede estar vacío' })
  @IsMongoId()
  @IsString()
  updatedBy: Types.ObjectId;
}
