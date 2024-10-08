import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: true })
  name: string; // Nombre de la empresa

  @Prop({ type: String, required: false })
  industry?: string; // Industria a la que pertenece la empresa

  @Prop({ type: String, required: false })
  email?: string; // Correo electrónico de contacto de la empresa

  @Prop({ type: String, required: false })
  phoneNumber?: string; // Número de teléfono de la empresa

  @Prop({ type: String, required: false })
  website?: string; // Sitio web de la empresa

  @Prop({ type: [String], required: false })
  addresses?: string[]; // Direcciones de la empresa

  @Prop({ type: [String], required: false })
  contacts?: string[]; // Contactos adicionales dentro de la empresa

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
