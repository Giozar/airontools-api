import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OtherProductsService } from './other-products.service';
import { CreateOtherProductDto } from './dto/create-other-product.dto';
import { UpdateOtherProductDto } from './dto/update-other-product.dto';

@Controller('other-products')
export class OtherProductsController {
  constructor(private readonly otherProductsService: OtherProductsService) {}

  @Post()
  createOtherProduct(@Body() createOtherProductDto: CreateOtherProductDto) {
    return this.otherProductsService.createOtherProduct(createOtherProductDto);
  }

  @Get()
  findAllOtherProducts() {
    return this.otherProductsService.findAllOtherProducts();
  }

  @Get(':id')
  findOneOtherProduct(@Param('id') id: string) {
    return this.otherProductsService.findOneOtherProduct(id);
  }

  @Patch(':id')
  updateOtherProduct(
    @Param('id') id: string,
    @Body() updateOtherProductDto: UpdateOtherProductDto,
  ) {
    return this.otherProductsService.updateOtherProduct(
      id,
      updateOtherProductDto,
    );
  }

  @Delete(':id')
  removeOtherProduct(@Param('id') id: string) {
    return this.otherProductsService.removeOtherProduct(id);
  }
}
