import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type familyDocument = HydratedDocument<Family>;

@Schema({
  timestamps: true,
})
export class Family {
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
}

export const FamilySchema = SchemaFactory.createForClass(Family);
