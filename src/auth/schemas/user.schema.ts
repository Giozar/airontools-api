import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({})
  imageUrl: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
