import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  image?: string[];

  @IsString()
  @IsNotEmpty()
  family: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  category: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
