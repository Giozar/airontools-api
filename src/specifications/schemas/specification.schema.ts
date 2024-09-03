import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type specificationDocument = HydratedDocument<Specification>;

@Schema({ timestamps: true })
export class Specification {
  @Prop({ required: true, unique: true, trim: true })
  name: string;
  @Prop({ trim: true })
  description: string;

  @Prop({})
  unit: string;

  @Prop({
    type: [Array<MongooseSchema.Types.ObjectId>],
    ref: 'Family',
    required: true,
  })
  families: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [Array<MongooseSchema.Types.ObjectId>],
    ref: 'Category',
  })
  categories: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [Array<MongooseSchema.Types.ObjectId>],
    ref: 'Subcategory',
  })
  subcategories: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const SpecificationSchema = SchemaFactory.createForClass(Specification);
