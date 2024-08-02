import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

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
    unique: true,
    required: true,
  })
  model: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Family', required: true })
  family: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  })
  subcategory: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  characteristics: string[];

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
