import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchCustomerDto {
  @IsOptional()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsOptional()
  @IsBoolean()
  autocomplete: boolean;
}

export interface SearchCustomerParams {
  keywords?: string;
  company: string;
  limit?: number;
  offset?: number;
  maxDistance?: number;
  autocomplete?: boolean; // Si se busca en un input autocomplete, para no mostrar todo
}
