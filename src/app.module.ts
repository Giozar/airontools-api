import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ configuration ],
    }),
    MongooseModule.forRoot( configuration().database.host ),
    ToolsModule,
    CategoriesModule,
    SubcategoriesModule,
    GptModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
