import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tool } from './schemas';
import { CreateToolDto, UpdateToolDto } from './dtos';

@Injectable()
export class ToolsService {
  constructor(@InjectModel(Tool.name) private toolModel: Model<Tool>) {}

  async toolSearch(
    keywords: string = '',
    limit: number = 10,
    offset: number = 0,
  ): Promise<any> {
    // Descomentar si se quiere devolver un objeto con la palabra clave y las herramientas encontradas
    // interface ToolSearchResult {
    //   keyword: string;
    //   tools: Tool[];
    // }

    const toolSearchResults: Tool[] = [];

    const keywordArray = keywords.split(' ');

    for (const keyword of keywordArray) {
      const tools = await this.toolModel
        .find({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { path: { $regex: keyword, $options: 'i' } },
            { overview: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { specification: { $regex: keyword, $options: 'i' } },
          ],
        })
        .limit(limit)
        .skip(offset)
        .sort({
          id: 1,
          // name: 1, // Ordena la propiedad ascendentemente
        });
      // .select('-created_at'); // Indica que en la respuesta no vendrá esta propiedad

      // Solo agregamos al resultado si se encontraron herramientas para la palabra clave actual
      if (tools.length > 0) {
        // Descomentar si se quiere devolver un objeto con la palabra clave y las herramientas encontradas
        // toolSearchResults.push({ keyword, tools });

        toolSearchResults.push(...tools);
      }
    }

    return toolSearchResults;
  }

  getToolsByCategoryId(id: number): Promise<Tool[]> {
    const tools = this.toolModel.find({ categoryId: id });
    return tools;
  }

  // TODO: cuando se haga la refactorización de la base de datos, cambiar la consulta de las herramientas de este método
  getToolsBySubcategoryId(id: number): Promise<Tool[]> {
    const tools = this.toolModel.find({ categoryId: id });
    return tools;
  }

  async createTool(tool: CreateToolDto) {
    const newTool = new this.toolModel(tool);
    return newTool.save();
  }

  async deleteTool(id: number) {
    return this.toolModel.findOneAndDelete({ id });
  }

  async findOneToolById(id: number) {
    return this.toolModel.findOne({ id });
  }

  async updateTool(id: number, tool: UpdateToolDto) {
    return this.toolModel.findOneAndUpdate({ id }, tool, { new: true });
  }
}
