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
import { SubcategoriesService } from './subcategories.service';
import {
  CreateSubcategoryDto,
  SubcategoryQueriesDto,
  UpdateSubcategoryDto,
} from './dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll(@Query() query: SubcategoryQueriesDto) {
    return this.subcategoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }

  @Delete('family/:id')
  removeByFamilyId(@Param('id') id: string) {
    return this.subcategoriesService.removeByFamilyId(id);
  }

  @Delete('category/:id')
  removeByCategoryId(@Param('id') id: string) {
    return this.subcategoriesService.removeByCategoryId(id);
  }
  //Arreglar a queries
  @Get('count/:familyId')
  async countByFamilyId(@Param('familyId') familyId: string): Promise<number> {
    return this.subcategoriesService.countByFamilyId(familyId);
  }
  @Get('countByCategory/:categoryId')
  async countByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<number> {
    return this.subcategoriesService.countByCategoryId(categoryId);
  }
}
