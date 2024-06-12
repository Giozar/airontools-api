import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    unique: true,
  })
  id: string;

  @Prop({
    unique: true,
    text: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    text: true,
    select: false,
  })
  password: string;

  @Prop({
    text: true,
    required: true,
  })
  fullName: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: ['user'],
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
