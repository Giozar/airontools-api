import { IsOptional, IsString } from 'class-validator';

export class ToolSearchDto {
  @IsOptional()
  @IsString()
  keywords: string;
}
