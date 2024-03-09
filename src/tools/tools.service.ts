import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool } from './schemas/tool.schema';

@Injectable()
export class ToolsService {
    constructor(@InjectModel(Tool.name) private toolModel: Model<Tool>){}

    getAllTools(): Promise<Tool[]>{
        return this.toolModel.find(); 
    }

    getToolsByCategoryId( id: number ): Promise<Tool[]> {
        const tools = this.toolModel.find({categoryId: id});
        return tools;
    }

    // TODO: cuando se haga la refactorización de la base de datos, cambiar la consulta de las herramientas de este método
    getToolsBySubcategoryId(id: number): Promise<Tool[]> {
        const tools = this.toolModel.find({categoryId: id});
        return tools;
    }

    async createTool(tool: CreateToolDto){
        const newTool = new this.toolModel(tool);
        return newTool.save();
    }

    async deleteTool(id: number){
        return this.toolModel.findOneAndDelete({id});
    }

    async findOneToolById(id: number){
        return this.toolModel.findOne({id});
    }

    async updateTool(id:number, tool: UpdateToolDto){
        return this.toolModel.findOneAndUpdate( {id}, tool, {new: true});
    }
}
