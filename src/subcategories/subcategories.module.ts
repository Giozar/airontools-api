import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';

@Module({
  providers: [SubcategoriesService],
  controllers: [SubcategoriesController]
})
export class SubcategoriesModule {}
