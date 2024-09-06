import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';

@Controller('specifications')
export class SpecificationsController {
  constructor(private readonly specificationsService: SpecificationsService) {}

  @Post()
  create(@Body() createSpecificationDto: CreateSpecificationDto) {
    return this.specificationsService.create(createSpecificationDto);
  }

  @Get()
  findAll() {
    return this.specificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return this.specificationsService.update(id, updateSpecificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specificationsService.remove(id);
  }

  @Delete('family/:id')
  removeByFamilyId(@Param('id') id: string) {
    return this.specificationsService.removeByFamilyId(id);
  }

  @Delete('category/:id')
  removeByCategoryId(@Param('id') id: string) {
    return this.specificationsService.removeByCategoryId(id);
  }
  @Delete('subcategory/:id')
  removeBySubcategoryId(@Param('id') id: string) {
    return this.specificationsService.removeBySubcategoryId(id);
  }
  @Get('family/:id')
  findAllByFamilyId(@Param('id') id: string) {
    return this.specificationsService.findAllByFamilyId(id);
  }
  @Get('category/:id')
  findAllByCategoryId(@Param('id') id: string) {
    return this.specificationsService.findAllByCategoryId(id);
  }
  @Get('subcategory/:id')
  findAllBySubcategoryId(@Param('id') id: string) {
    return this.specificationsService.findAllBySubcategoryId(id);
  }
  @Get('count/:family')
  async countByFamilyId(@Param('family') family: string): Promise<number> {
    return this.specificationsService.countByFamilyId(family);
  }
  //Cambiar por queries TODO:
  @Get('countByCategory/:category')
  async countByCategoryId(
    @Param('category') category: string,
  ): Promise<number> {
    return this.specificationsService.countByCategoryId(category);
  }
  @Get('countBySubcategory/:subcategory')
  async countBySubcategoryId(
    @Param('subcategory') subcategory: string,
  ): Promise<number> {
    return this.specificationsService.countBySubcategoryId(subcategory);
  }
}
