import { IsNumber, IsString, IsOptional } from 'class-validator';
export class UpdateToolDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  subcategoryId?: number;

  @IsOptional()
  @IsNumber()
  subsubcategoryId?: number;

  @IsString()
  @IsOptional()
  path?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  overview?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  advantages?: string;

  @IsOptional()
  @IsString()
  specification?: string;
}
