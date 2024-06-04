import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private subcategoriesService: SubcategoriesService) {}

  @Get()
  async getSubcategories() {
    return this.subcategoriesService.getSubcategories();
  }

  @Get(':categoryId')
  async getSubcategoriesByCategoryId(@Param('categoryId') categoryId: number) {
    if (isNaN(categoryId))
      throw new NotFoundException('categoryId is not a number.');
    const subcategories =
      await this.subcategoriesService.getSubcategoriesByCategoryId(categoryId);
    if (subcategories.length === 0)
      throw new NotFoundException(
        'Error: No subcategories found with the provided categoryId.',
      );
    return subcategories;
  }
}
