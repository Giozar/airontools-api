import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type categoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
})
export class Category {
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
}

export const CategorySchema = SchemaFactory.createForClass(Category);
