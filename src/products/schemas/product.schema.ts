import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type productDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  model: string;

  @Prop({ required: true })
  familyId: number;

  @Prop({ required: true })
  categoryId: number;

  @Prop({})
  subcategoryId: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  characteristics: string;

  @Prop({ type: [mongoose.Schema.Types.Mixed] }) // Usa Mixed para permitir cualquier tipo de objeto
  specifications: Array<Record<string, any>>;

  @Prop({})
  imagesUrl: string[];

  @Prop({})
  manuals: string[];

  @Prop({})
  videos: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
