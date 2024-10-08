import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RepairProductDto } from './dto/repair-product.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post('repair-product')
  async createRepairProduct(@Body() createRepairProductDto: RepairProductDto) {
    return this.ordersService.createRepairProduct(createRepairProductDto);
  }

  @Patch('repair-product/:id')
  async updateRepairProduct(
    @Param('id') id: string,
    @Body() updateRepairProductDto: RepairProductDto,
  ) {
    return this.ordersService.updateRepairProduct(id, updateRepairProductDto);
  }

  @Get('repair-product')
  async findAllRepairProducts() {
    return this.ordersService.findAllRepairProducts();
  }

  @Get('repair-product/:id')
  async findOneRepairProduct(@Param('id') id: string) {
    return this.ordersService.findOneRepairProduct(id);
  }

  @Delete('repair-product/:id')
  async removeRepairProduct(@Param('id') id: string) {
    return this.ordersService.removeRepairProduct(id);
  }
}
