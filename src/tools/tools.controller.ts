import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put} from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dtos/create-tool.dto';
import { UpdateToolDto } from './dtos/update-tool.dto';
import { SearchToolDto } from './dtos/search-tool.dto';

@Controller('tools')
export class ToolsController {
    
    constructor(private toolsService : ToolsService){}
    
    @Get()
    getAllTools(){
        return this.toolsService.getAllTools();
    }

    @Post('keyword-search')
    async getAllByKeywords(
        @Body() search: SearchToolDto
    ) {
        const response = await this.toolsService.getAllByKeywords( search.keywords, );
        return response;
    }

    @Get(':toolId')
    async findOneToolById(@Param('toolId') toolId: number) {
        const tool = await this.toolsService.findOneToolById(toolId);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }

    @Get('/herramientas/:categoryId/:categoryName/p/:toolId/:toolName')
    async findOneToolInCategory(@Param('toolId') toolId: number) {
        const tool = await this.toolsService.findOneToolById(toolId);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }

    @Get('/herramientas/:categoryId/:categoryName/:subcategoryId/:subcategoryName/p/:toolId/:toolName')
    async findOneToolInSubategory(@Param('toolId') toolId: number) {
        const tool = await this.toolsService.findOneToolById(toolId);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }

    @Get('herramientas/:categoryId/:categoryName')
    async getToolsByCategoryId(@Param('categoryId') categoryId: number ) {
        if(isNaN(categoryId)) throw new NotFoundException('Id is not a number.');
        const tools = await this.toolsService.getToolsByCategoryId(categoryId);
        if(!tools) throw new NotFoundException('Error: No tools found with the provided categoryId.');
        return tools;
    }

    @Get('herramientas/:categoryId/:name/:subcategoryId/:subcategoryName')
    async getToolsBySubcategoryId(@Param('subcategoryId') subcategoryId: number ) {
        if(isNaN(subcategoryId)) throw new NotFoundException('Id is not a number.');
        const tools = await this.toolsService.getToolsBySubcategoryId(subcategoryId);
        if(!tools) throw new NotFoundException('Error: No tools found with the provided subcategoryId.');
        return tools;
    }

    @Post()
    async createTool(@Body() body: CreateToolDto){
        try {
            return await this.toolsService.createTool(body);
        } catch (error) {
            if( error.code === 11000){
                throw new ConflictException(`Duplication error, Tool ${error} already exists!`);
            }
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteTool(@Param('id') id: number){
        const tool = await this.toolsService.deleteTool(id);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }

    @Put(':id')
    async updateTool(@Param('id') id: number, @Body() body:UpdateToolDto){
        try {
            const tool = await this.toolsService.updateTool(id, body);
            if(!tool) throw new NotFoundException('Tool not found');
            return tool;
        } catch (error) {
            if( error.code === 11000){
                throw new ConflictException(`Duplication error, Tool ${error} already exists!`);
            }
            throw error;
        }
    }
}
