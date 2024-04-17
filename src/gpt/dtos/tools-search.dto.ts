import { IsString } from "class-validator";

export class ToolsSearchDto {
    @IsString()
    readonly prompt: string;

}