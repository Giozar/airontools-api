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
  Patch,
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

  @Post()
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

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productsService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
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

  @Post('search')
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

  @Get(':id')
  async findOneToolById(@Param('id') id: string) {
    const product = await this.productsService.findOneProductById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Get(':id')
  findAll() {
    const products = this.productsService.findAll();
    return products;
  }
}
