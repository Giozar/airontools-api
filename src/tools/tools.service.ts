import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tool } from './schemas';
import { CreateToolDto, UpdateToolDto } from './dtos';

@Injectable()
export class ToolsService {
    constructor(@InjectModel(Tool.name) private toolModel: Model<Tool>){}

    getAllTools(): Promise<Tool[]>{
        return this.toolModel.find(); 
    }

    async getAllByKeywords(keywords: string = ''): Promise<any> {
      interface ToolSearchResult {
        keyword: string;
        tools: Tool[];
      }
    
      const toolSearchResults: ToolSearchResult[] = [];
      
      // Si la busqueda ingresada está vacía no hace ninguna busqueda
      if (keywords.trim() === '') {
        return toolSearchResults;
      }
    
      const keywordArray = keywords.split(' ');
    
      for (const keyword of keywordArray) {
        const tools = await this.toolModel.find({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { path: { $regex: keyword, $options: 'i' } },
            { overview: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { specification: { $regex: keyword, $options: 'i' } }
          ]
        });
    
        // Solo agregamos al resultado si se encontraron herramientas para la palabra clave actual
        if (tools.length > 0) {
          toolSearchResults.push({ keyword, tools });
        }
      }
    
      return toolSearchResults;
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
