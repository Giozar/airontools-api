import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tool, ToolSchema } from './schemas/tools.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Tool.name,
      schema: ToolSchema,
    }
  ])],
  providers: [ToolsService],
  controllers: [ToolsController]
})
export class ToolsModule {}
