import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { SearchProductsDto } from './dtos';
import { searchProductsUseCase } from './uses-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Solo va a llamar casos de uso
  async searchProducts({ prompt }: SearchProductsDto) {
    return await searchProductsUseCase(this.openai, { prompt });
  }
}
