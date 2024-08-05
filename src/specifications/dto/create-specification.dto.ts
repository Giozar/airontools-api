import {
  IsAlphanumeric,
  IsMongoId,
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
  @IsMongoId()
  @IsNotEmpty()
  family: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  subcategory: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
