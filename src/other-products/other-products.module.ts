import { Module } from '@nestjs/common';
import { OtherProductsService } from './other-products.service';
import { OtherProductsController } from './other-products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OtherProduct,
  OtherProductSchema,
} from './schemas/other-product.schema';

@Module({
  controllers: [OtherProductsController],
  providers: [OtherProductsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: OtherProduct.name,
        schema: OtherProductSchema,
      },
    ]),
  ],
})
export class OtherProductsModule {}
