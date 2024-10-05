import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: String, required: false })
  companyName?: string; // Solo si el cliente es una empresa

  @Prop({ type: String, required: false })
  email?: string; // Correo electrónico del cliente

  @Prop({ type: String, required: false })
  phoneNumber?: string; // Teléfono de contacto

  @Prop({ type: AddressSchema, required: true })
  address: Address; // Dirección del cliente

  @Prop({ type: [String], required: false })
  additionalContacts?: string[]; // Contactos adicionales, si los hay
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
