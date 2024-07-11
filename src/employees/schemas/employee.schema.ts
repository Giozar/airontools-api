import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema()
export class Employee {
  @Prop({
    required: true,
  })
  name: string;

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
  })
  password: string;

  @Prop({
    default: ['employee'],
  })
  roles: string[];

  @Prop({
    required: true,
  })
  permissions: [];
  created_at: string;

  @Prop({
    required: true,
  })
  created_by: string;

  @Prop({
    required: true,
  })
  updated_at: string;

  @Prop({
    required: true,
  })
  updated_by: string;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
