import { IsAlphanumeric, IsOptional, IsString } from "class-validator";

export class SearchToolDto {

    @IsOptional()
    @IsString()
    keywords: string;
}