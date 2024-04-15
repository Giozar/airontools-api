import { IsString } from "class-validator";

export class ToolsQuery {
    @IsString()
    readonly prompt: string;

}