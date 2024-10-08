import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type RepairProductDocument = RepairProduct & Document;

@Schema()
export class RepairProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: false })
  productId?: Types.ObjectId; // ID del producto si es un producto interno

  @Prop({ type: String, required: false })
  serialNumber?: string; // Número de serie del producto (opcional)

  @Prop({ type: String, required: true })
  description: string; // Descripción del estado del producto y fallas encontradas

  @Prop({ type: Number, required: true })
  quantity: number; // Cantidad de productos en la orden de reparación

  @Prop({ type: [String], required: false })
  images?: string[]; // Imágenes opcionales del producto

  @Prop({ type: [String], required: false })
  observations?: string[]; // Observaciones adicionales específicas de este producto
}

export const RepairProductSchema = SchemaFactory.createForClass(RepairProduct);
