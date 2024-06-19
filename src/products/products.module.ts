import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import * as AutoIncrementFactory from 'mongoose-sequence';
import databaseConfig from '@config/databaseConfig';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: (connection) => {
          const schema = ProductSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 });
          return schema;
        },
        inject: [getConnectionToken(databaseConfig().database.host)],
      },
    ]),
  ],
})
export class ProductsModule {}
