import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Tool, ToolSchema } from './schemas/tool.schema';
import * as AutoIncrementFactory from 'mongoose-sequence';
import databaseConfig from '@config/databaseConfig';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tool.name,
        useFactory: (connection) => {
          const schema = ToolSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 });
          return schema;
        },
        inject: [getConnectionToken(databaseConfig().database.host)],
      },
    ]),
  ],
  providers: [ToolsService],
  controllers: [ToolsController],
})
export class ToolsModule {}
