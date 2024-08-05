import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'El campo updatedBy no puede estar vacío' })
  @IsMongoId()
  @IsString()
  updatedBy: Types.ObjectId;
}
