import { IsString, IsOptional } from 'class-validator';

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
  @IsString()
  image?: string;
}
