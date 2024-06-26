import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ConflictException,
  HttpCode,
  NotFoundException,
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { SearchProductDto } from './dtos';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  async createProduct(@Body() body: CreateProductDto) {
    try {
      return await this.productsService.createProduct(body);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Duplication error, Product ${error} already exists!`,
        );
      }
      throw new InternalServerErrorException(
        `something went wrong, server error: ${error}`,
      );
    }
  }

  // Endpoint para reiniciar el contador
  @Post('reset-counter')
  async resetCounter() {
    await this.productsService.resetCounter();
    return { message: 'Counter reset successfully' };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: number) {
    const product = await this.productsService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    try {
      const product = await this.productsService.updateProduct(id, body);
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Duplication error, Product ${error} already exists!`,
        );
      }
      throw error;
    }
  }

  @Post()
  async searchProduct(
    @Body() search: SearchProductDto,
    @Query() { limit, offset }: PaginationDto,
  ) {
    const response = await this.productsService.searchProduct(
      search.keywords,
      limit,
      offset,
    );
    return response;
  }

  @Get(':productId')
  async findOneToolById(@Param('productId') productId: number) {
    const product = await this.productsService.findOneProductById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
