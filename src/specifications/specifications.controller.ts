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
}
