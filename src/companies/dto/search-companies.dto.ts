import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchCompaniesDto {
  @IsOptional()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsBoolean()
  autocomplete: boolean;
}
