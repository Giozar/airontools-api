import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AddressDto, CustomerType } from '../dto/create-customer.dto';

export type CustomerDocument = Customer & Document;

@Schema({
  timestamps: true,
})
export class Customer {
  @Prop({ required: true, enum: CustomerType })
  customerType: CustomerType; // Tipo de cliente: individuo o empresa

  @Prop({ required: true })
  name: string; // Nombre del cliente

  @Prop({ type: Types.ObjectId, ref: 'Company' }) // Relación con la empresa
  company?: Types.ObjectId; // Solo si el cliente es una empresa

  @Prop({ required: false }) // Correo electrónico del cliente (opcional)
  email?: string;

  @Prop({ required: true }) // Teléfono de contacto (requerido)
  phoneNumber: string;

  @Prop({ type: Object, required: false }) // Dirección del cliente (opcional)
  address?: AddressDto;

  @Prop({ type: [String], required: false }) // Contactos adicionales (opcional)
  additionalContacts?: string[];

  @Prop({ type: Types.ObjectId, required: true }) // Creador del registro
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId }) // Actualizador del registro (opcional)
  updatedBy?: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
