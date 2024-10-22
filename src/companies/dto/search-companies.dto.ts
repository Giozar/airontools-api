import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchCompaniesDto {
  @IsOptional()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsBoolean()
  autocomplete: boolean;
}

export interface SearchCompanyParams {
  keywords?: string;
  limit?: number;
  offset?: number;
  maxDistance?: number;
  autocomplete?: boolean; // Si se busca en un input autocomplete, para no mostrar todo
}
