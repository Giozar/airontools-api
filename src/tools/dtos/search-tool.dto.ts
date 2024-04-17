import { IsAlphanumeric, IsOptional } from "class-validator";

export class SearchToolDto {

    @IsOptional()
    @IsAlphanumeric()
    keyword1: string;

    @IsOptional()
    @IsAlphanumeric()
    keyword2: string;
}