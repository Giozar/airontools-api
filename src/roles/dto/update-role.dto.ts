import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty({ message: 'El campo updatedBy no puede estar vacío' })
  @IsMongoId()
  @IsString()
  updatedBy: Types.ObjectId;
}
