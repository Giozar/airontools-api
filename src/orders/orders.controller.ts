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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchDto } from 'src/common/dtos/search.dto';
import { PaginationDtoTemp } from 'src/common/dtos/pagination.dto';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post('search')
  async searchProduct(
    @Body() search: SearchDto,
    @Query() { limit, page }: PaginationDtoTemp,
  ) {
    const response = await this.ordersService.searchOrder(
      search.keywords,
      limit,
      page,
    );
    return response;
  }

  @Patch('repair-order/:id')
  createRepairOrder(
    @Param('id') id: string,
    @Body() createRepairOrderDto: CreateRepairOrderDto,
  ) {
    return this.ordersService.createRepairOrder(id, createRepairOrderDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
