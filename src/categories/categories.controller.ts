import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoryQueriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: CategoryQueriesDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Delete('family/:id')
  removeByFamilyId(@Param('id') id: string) {
    return this.categoriesService.removeByFamilyId(id);
  }
  @Get('count/:familyId')
  async countByFamilyId(@Param('familyId') familyId: string): Promise<number> {
    return this.categoriesService.countByFamilyId(familyId);
  }
}
