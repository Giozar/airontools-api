import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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

  @Prop({})
  characteristics: string[];

  @Prop({})
  includedItems: string[];

  @Prop({})
  opcionalAccessories: string[];

  @Prop({})
  operationRequirements: string[];

  @Prop({})
  applications: string[];

  @Prop({})
  recommendations: string[];

  @Prop({})
  technicalDatasheet: string[];

  @Prop({
    type: [
      {
        specification: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Specification',
        },
        value: { type: String, required: true },
      },
    ],
  })
  specifications: Array<{
    specification: MongooseSchema.Types.ObjectId;
    value: string;
  }>;
  @Prop({})
  images: string[];

  @Prop({})
  webImages: string[];

  @Prop({})
  manuals: string[];

  @Prop({})
  videos: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
