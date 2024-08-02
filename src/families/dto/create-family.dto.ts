import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
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
  image?: string[];

  @IsString()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
