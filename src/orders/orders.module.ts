import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from 'src/counters/schemas/counter.schema';
import { CountersModule } from 'src/counters/counters.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Counter.name,
        schema: CounterSchema,
      },
    ]),
    CountersModule,
  ],
})
export class OrdersModule {}
