import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
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

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  families: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  categories: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  subcategories: Types.ObjectId[];

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
