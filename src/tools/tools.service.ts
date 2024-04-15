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

    async getAllByKeywords( keyword1: string = '', keyword2: string = '' ): Promise<Tool[]>{

        if (keyword1.length == 0 && keyword2.length == 0) {
            return [];
        }
        const tools = await this.toolModel
        .find({
            $and: [
              {
                $or: [
                  { name: { $regex: keyword1, $options: 'i' } },
                  { path: { $regex: keyword1, $options: 'i' } },
                  { overview: { $regex: keyword1, $options: 'i' } },
                  { description: { $regex: keyword1, $options: 'i' } },
                  { specification: { $regex: keyword1, $options: 'i' } }
                ]
              },
              {
                $or: [
                  { name: { $regex: keyword2, $options: 'i' } },
                  { path: { $regex: keyword2, $options: 'i' } },
                  { overview: { $regex: keyword2, $options: 'i' } },
                  { description: { $regex: keyword2, $options: 'i' } },
                  { specification: { $regex: keyword2, $options: 'i' } }
                ]
              }
            ]
          });
        //   console.log(tools.length);
        return tools;
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
