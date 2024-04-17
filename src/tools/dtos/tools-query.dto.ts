import { IsString } from "class-validator";

export class ToolsQueryDto {
    @IsString()
    readonly prompt: string;

}