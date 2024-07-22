import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsString()
  image?: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsString()
  familyId: string;

  @IsString()
  categoryId: string;
}
