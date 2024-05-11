import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ToolsSearchDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('tools-search')
  async toolsSearch(@Body() toolsSearchDto: ToolsSearchDto) {
    return await this.gptService.searchTool(toolsSearchDto);
  }
}
