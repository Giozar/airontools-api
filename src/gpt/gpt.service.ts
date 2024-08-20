import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { SearchProductsDto } from './dtos';
import { searchProductsUseCase } from './uses-cases';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GptService {
  constructor(private configService: ConfigService) {}

  private apiKeyOpenAI = this.configService.get<string>('apiKeyOpenAI');

  private openAI = new OpenAI({
    apiKey: this.apiKeyOpenAI,
  });

  // Solo va a llamar casos de uso
  async searchProducts({ prompt }: SearchProductsDto) {
    return await searchProductsUseCase(this.openAI, { prompt });
  }
}
