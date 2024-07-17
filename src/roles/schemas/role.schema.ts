import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type roleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: [{ type: String, required: true }] })
  permissions: object;

  @Prop({ required: true })
  createdBy: string;

  @Prop({})
  updatedBy?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
