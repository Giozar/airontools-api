import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFamilyDto {
  @IsString()
  name: string;

  @IsOptional()
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
