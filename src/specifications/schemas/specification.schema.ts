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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const SpecificationSchema = SchemaFactory.createForClass(Specification);
