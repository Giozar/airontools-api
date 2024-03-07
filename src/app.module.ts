import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ configuration ],
    }),
    MongooseModule.forRoot( configuration().database.host ),
    ToolsModule,
    CategoriesModule,
    SubcategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
