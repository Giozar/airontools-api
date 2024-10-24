import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ConflictException,
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
  async create(@Body() body: CreateProductDto) {
    try {
      return await this.productsService.create(body);
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
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    try {
      const product = await this.productsService.update(id, body);
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
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Get()
  findAll() {
    const products = this.productsService.findAll();
    return products;
  }

  @Get('brand/:brand')
  findAllByBrand(@Param('brand') brand: string) {
    return this.productsService.findAllByBrand(brand);
  }

  @Get('family/:id')
  findAllByFamilyId(@Param('id') id: string) {
    return this.productsService.findAllByFamilyId(id);
  }
  @Get('category/:id')
  findAllByCategoryId(@Param('id') id: string) {
    return this.productsService.findAllByCategoryId(id);
  }
  @Get('subcategory/:id')
  findAllBySubcategoryId(@Param('id') id: string) {
    return this.productsService.findAllBySubcategoryId(id);
  }

  @Get('specification/:id')
  findAllBySpecificationId(@Param('id') id: string) {
    const products = this.productsService.findAllBySpecificationId(id);
    return products;
  }

  @Get('count/:family')
  async countByFamilyId(@Param('family') family: string): Promise<number> {
    return this.productsService.countByFamilyId(family);
  }
  //Cambiar por queries
  @Get('countByCategory/:category')
  async countByCategoryId(
    @Param('category') category: string,
  ): Promise<number> {
    return this.productsService.countByCategoryId(category);
  }
  @Get('countBySubcategory/:subcategory')
  async countBySubcategoryId(
    @Param('subcategory') subcategory: string,
  ): Promise<number> {
    return this.productsService.countBySubcategoryId(subcategory);
  }
  @Get('countBySpecification/:specification')
  async countBySpecificationId(
    @Param('specification') specification: string,
  ): Promise<number> {
    return this.productsService.countBySpecificationId(specification);
  }
}
