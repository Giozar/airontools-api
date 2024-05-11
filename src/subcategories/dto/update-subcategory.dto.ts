import { IsOptional, IsNumber, IsString } from 'class-validator';

export class createSubcategoryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  image: string;
}
