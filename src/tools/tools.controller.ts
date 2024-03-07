import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Controller('tools')
export class ToolsController {
    
    constructor(private toolsService : ToolsService){}
    
    @Get()
    getAllTools(){
        return this.toolsService.getAllTools();
    }

    @Get(':id')
    async findOneTool(@Param('id') id: number) {
        const tool = await this.toolsService.findOneTool(id);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }
    
    @Get(':name/:id')
    async getToolsForCategoryId(@Param('id') id: number ) {
        if(isNaN(id)) throw new NotFoundException('Id is not a number.');
        const tools = await this.toolsService.getToolsForCategoryId(id);
        if(!tools) throw new NotFoundException('Error: No tools found with the provided categoryId.');
        return tools;
    }
    

    @Post()
    async createTool(@Body() body: CreateToolDto){
        try {
            return await this.toolsService.createTool(body);
        } catch (error) {
            if( error.code === 11000){
                throw new ConflictException('Tool already exists');
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
        const tool = await this.toolsService.updateTool(id, body);
        if(!tool) throw new NotFoundException('Tool not found');
        return tool;
    }
}
