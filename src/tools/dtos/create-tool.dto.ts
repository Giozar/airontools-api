import {IsNumber, IsString, IsNotEmpty, IsOptional} from 'class-validator'
export class CreateToolDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    categoryId?: number;
    
    @IsNotEmpty()
    @IsNumber()
    subcategoryId?: number;
    
    @IsOptional()
    @IsNumber()
    subsubcategoryId?: number;

    @IsString()
    path?: string;

    @IsNotEmpty()
    @IsString()
    image?: string;

    @IsString()
    overview?: string;
    
    @IsString()
    description?: string;
    
    @IsString()
    advantages?: string;

    @IsString()
    specification?: string;
}