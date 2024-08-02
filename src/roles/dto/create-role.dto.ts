import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  @IsOptional()
  permissions: object;

  @IsString()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
