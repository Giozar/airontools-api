import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createSubcategoryDto {
    
    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsString()
    image: string;

}