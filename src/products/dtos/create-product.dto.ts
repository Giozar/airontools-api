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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuals: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos: string[];

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @IsArray()
  specifications: ProductSpecificationDto[];

  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
