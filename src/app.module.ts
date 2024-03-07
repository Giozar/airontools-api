import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/airontools'),
    ToolsModule,
    CategoriesModule,
    SubcategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
