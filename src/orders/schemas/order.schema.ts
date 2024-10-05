import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { OrderType } from '../dto/create-order.dto';
import { RepairProductDto } from '../dto/repair-product.dto';
import { User } from 'src/auth/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customer: Types.ObjectId; // Relación con el cliente (Customer)

  @Prop({ type: String, enum: OrderType, required: true })
  orderType: OrderType; // Tipo de orden (en este caso, 'repair')

  @Prop({ type: Date, required: true })
  orderDate: Date; // Fecha de creación de la orden

  @Prop({ type: [{ type: Object, required: true }], _id: false })
  products: RepairProductDto[]; // Productos a reparar

  @Prop({ type: String })
  observations?: string; // Observaciones generales de la orden

  @Prop({ type: [String] })
  images?: string[]; // Imágenes opcionales

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  receivedBy: MongooseSchema.Types.ObjectId | User; // Empleado que recibe el producto

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  responsible: MongooseSchema.Types.ObjectId | User; // Empleado responsable de la orden

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
