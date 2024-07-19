import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
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

  @Prop({
    default: 'Usuario',
  })
  roles: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({})
  createdBy: string;

  @Prop({ default: Date.now() })
  updatedAt: Date;

  @Prop({})
  updatedBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware para actualizar las fechas
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = this.updatedAt = new Date();
  } else {
    this.updatedAt = new Date();
  }
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
