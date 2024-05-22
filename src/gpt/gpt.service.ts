import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ToolsSearchDto } from './dtos';
import { toolSearchUseCase } from './uses-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Solo va a llamar casos de uso
  async searchTool({ prompt }: ToolsSearchDto) {
    return await toolSearchUseCase(this.openai, { prompt });
  }
}
