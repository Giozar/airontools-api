import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { SearchProductsDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('search-products')
  async searchProducts(@Body() productsSearchDto: SearchProductsDto) {
    // console.log(productsSearchDto);
    return await this.gptService.searchProducts(productsSearchDto);
  }
}
