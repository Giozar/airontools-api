import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RepairProduct,
  RepairProductSchema,
} from './schemas/repair-product.schema';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: RepairProduct.name,
        schema: RepairProductSchema,
      },
    ]),
  ],
})
export class OrdersModule {}
