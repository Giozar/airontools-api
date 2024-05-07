import { IsOptional, IsNumber, Min, IsPositive } from 'class-validator';
export class ToolsPaginationDto {
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;
}