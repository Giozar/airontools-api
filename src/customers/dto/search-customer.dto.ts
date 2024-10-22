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

  @IsOptional()
  @IsString()
  customerType: string;
}

export interface SearchCustomerParams {
  keywords?: string;
  company: string;
  customerType?: string;
  limit?: number;
  offset?: number;
  maxDistance?: number;
  autocomplete?: boolean; // Si se busca en un input autocomplete, para no mostrar todo
}
