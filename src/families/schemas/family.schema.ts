import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ required: true })
  path: string;

  @Prop()
  description: string;

  @Prop()
  images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
