import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type specificationDocument = HydratedDocument<Specification>;

@Schema({ timestamps: true })
export class Specification {
  @Prop({ required: true, unique: true, trim: true })
  name: string;
  @Prop({ trim: true })
  description: string;

  @Prop()
  units: string;

  @Prop()
  familyId: string;

  @Prop()
  categoryId: string;

  @Prop()
  subcategoryId;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const SpecificationSchema = SchemaFactory.createForClass(Specification);
