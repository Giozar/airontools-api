import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import databaseConfig from '@config/databaseConfig';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: (connection) => {
          const schema = OrderSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'control', start_seq: 1 });
          return schema;
        },
        inject: [getConnectionToken(databaseConfig().database.host)],
      },
    ]),
  ],
})
export class OrdersModule {}
