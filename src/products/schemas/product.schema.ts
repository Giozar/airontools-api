import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type productDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    unique: true,
  })
  id: number;

  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  categoryId: number;

  @Prop({
    required: true,
  })
  subcategoryId: number;

  @Prop()
  subsubcategoryId: number;

  @Prop()
  path: string;

  @Prop()
  imageUrl: string;

  @Prop()
  description: string;

  @Prop({ type: [mongoose.Schema.Types.Mixed] }) // Usa Mixed para permitir cualquier tipo de objeto
  specifications: Array<Record<string, any>>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
