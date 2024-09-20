import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Family } from 'src/families/schemas/family.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { TechnicalDatasheetDto } from '../dtos/technicalDatasheet.dto';

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
  family: MongooseSchema.Types.ObjectId | Family;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: MongooseSchema.Types.ObjectId | Category;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  })
  subcategory: MongooseSchema.Types.ObjectId | Subcategory;

  @Prop({ required: true })
  description: string;

  @Prop({})
  characteristics: string[];

  @Prop({})
  includedItems: string[];

  @Prop({})
  optionalAccessories: string[];

  @Prop({})
  operationRequirements: string[];

  @Prop({})
  applications: string[];

  @Prop({})
  recommendations: string[];

  @Prop({})
  technicalDatasheet: TechnicalDatasheetDto;

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
    specification: MongooseSchema.Types.ObjectId | Specification;
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
  createdBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
