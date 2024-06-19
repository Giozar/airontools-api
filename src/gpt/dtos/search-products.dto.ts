import { IsString } from 'class-validator';

export class SearchProductsDto {
  @IsString()
  readonly prompt: string;
}
