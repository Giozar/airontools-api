import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type productDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
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
  familyId: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({})
  subcategoryId: string;

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

  @Prop({ required: true })
  createdBy: string;

  @Prop({})
  updatedBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
