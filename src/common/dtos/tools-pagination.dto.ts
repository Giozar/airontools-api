import { IsOptional, IsNumber, Min, IsPositive } from 'class-validator';
export class ToolsPaginationDto {
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;
}