import { IsOptional, IsString } from 'class-validator';

export class SearchCustomerDto {
  @IsOptional()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsString()
  companyId: string;
}
