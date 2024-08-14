import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFamilyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsMongoId()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
