import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private subcategoriesService: SubcategoriesService) {}

  @Get()
  async getAllSubcategories() {
    return this.subcategoriesService.getAllSubcategories();
  }

  @Get('herramientas/:categoryId/:categoryName')
  async getSubategoriesForId(@Param('categoryId') categoryId: number) {
    if (isNaN(categoryId))
      throw new NotFoundException('categoryId is not a number.');
    const subcategories =
      await this.subcategoriesService.getSubcategoriesForId(categoryId);
    if (subcategories.length === 0)
      throw new NotFoundException(
        'Error: No subcategories found with the provided categoryId.',
      );
    return subcategories;
  }
}
