import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Company } from 'src/companies/schemas/company.schema';

export type CustomerDocument = Customer & Document;

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Schema()
class Address {
  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  postalCode: string;

  @Prop({ type: String, required: false })
  country?: string; // Opcional, en caso de que necesites registrar países diferentes
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: String, enum: CustomerType, required: true })
  customerType: CustomerType; // Tipo de cliente: individuo o empresa

  @Prop({ type: String, required: true })
  name: string; // Nombre del cliente (nombre completo o nombre de la empresa)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Company' })
  company?: MongooseSchema.Types.ObjectId | Company;

  @Prop({ type: String, required: false })
  email?: string; // Correo electrónico del cliente

  @Prop({ type: String, required: false })
  phoneNumber?: string; // Teléfono de contacto

  @Prop({ type: AddressSchema, required: true })
  address: Address; // Dirección del cliente

  @Prop({ type: [String], required: false })
  additionalContacts?: string[]; // Contactos adicionales, si los hay

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
