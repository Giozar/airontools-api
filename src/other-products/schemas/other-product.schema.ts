import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Family } from 'src/families/schemas/family.schema';
import { TechnicalDatasheetDto } from 'src/products/dtos/technicalDatasheet.dto';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';

export type productDocument = HydratedDocument<OtherProduct>;

@Schema({
  timestamps: true,
})
export class OtherProduct {
  @Prop({ required: false })
  name: string;

  @Prop({ type: String, required: true })
  brand: string; // Marca del producto, obligatorio en caso de reparación (puede ser externo o interno)

  @Prop({ type: String, required: true })
  model: string; // Modelo del producto

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Family', required: false })
  family: MongooseSchema.Types.ObjectId | Family;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  category: MongooseSchema.Types.ObjectId | Category;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Subcategory',
    required: false,
  })
  subcategory: MongooseSchema.Types.ObjectId | Subcategory;

  @Prop({ required: false })
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
        value: { type: String, required: false },
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const OtherProductSchema = SchemaFactory.createForClass(OtherProduct);
