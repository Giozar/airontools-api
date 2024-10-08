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
import { TechnicalDatasheetDto } from './technicalDatasheet.dto';

export class CreateProductDto {
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  brand: string; // Marca del producto, obligatorio en caso de reparación (puede ser externo o interno)

  @IsNotEmpty()
  @IsString()
  model: string; // Modelo del producto

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
  @IsNotEmpty()
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
  @Type(() => TechnicalDatasheetDto)
  @ValidateNested({ each: true })
  technicalDatasheet: TechnicalDatasheetDto;

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
