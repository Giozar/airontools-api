import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { ProductSpecificationDto } from './productSpecification.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsMongoId()
  family: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  category: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  subcategory: Types.ObjectId;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedItems: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionalAccessories: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  operationRequirements: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applications: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technicalDatasheet: string[];

  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @IsArray()
  specifications: ProductSpecificationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  webImages: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuals: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos: string[];

  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  updatedBy: Types.ObjectId;
}
