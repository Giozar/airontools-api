import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:2701/airontools'),
    ToolsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
