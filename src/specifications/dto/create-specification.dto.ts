import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSpecificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  unit: string;

  @IsAlphanumeric()
  @IsOptional()
  units: string;

  @IsString()
  @IsNotEmpty()
  family: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  category: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  subcategory: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
