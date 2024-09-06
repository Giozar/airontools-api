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

  @Get('family:id')
  findOneByFamilyId(@Param('id') id: string) {
    return this.subcategoriesService.findOneByFamilyId(id);
  }

  @Get('category:id')
  findOneByCategoryId(@Param('id') id: string) {
    return this.subcategoriesService.findOneByCategoryId(id);
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
  @Get('count/:family')
  async countByFamilyId(@Param('family') family: string): Promise<number> {
    return this.subcategoriesService.countByFamilyId(family);
  }
  @Get('countByCategory/:category')
  async countByCategoryId(
    @Param('category') category: string,
  ): Promise<number> {
    return this.subcategoriesService.countByCategoryId(category);
  }
}
