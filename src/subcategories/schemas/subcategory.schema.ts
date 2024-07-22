import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type subcategoryDocument = HydratedDocument<Subcategory>;

@Schema({
  timestamps: true,
})
export class Subcategory {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  path: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;

  @Prop({ required: true })
  familyId: string;

  @Prop({ required: true })
  categoryId: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
