import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';
import { RepairProductDto } from './repair-product.dto';

export enum OrderType {
  REPAIR = 'Reparación',
}

export enum OrderStatus {
  ENTERED = 'Ingresado',
  UNDER_REVIEW = 'En revisión',
  ACCEPTED = 'Aceptada',
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En progreso',
  IN_PROCESS = 'En proceso',
  ON_HOLD = 'En espera',
  COMPLETED = 'Completado',
  FINALIZED = 'Finalizado',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado',
  REJECTED = 'Rechazado',
}

export class CreateOrderDto {
  @IsOptional()
  @IsMongoId()
  company?: Types.ObjectId; // Solo si el cliente es una empresa

  @IsNotEmpty()
  @IsMongoId()
  customer: Types.ObjectId; // Relación con el cliente (CustomerDto)

  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType; // Tipo de orden (en este caso, 'repair')

  @IsOptional()
  authorizationDate: Date; // Fecha de autorización de la orden

  @IsNotEmpty()
  @IsString()
  quoteDeliveryTime: string;

  @IsOptional()
  deliveryDate: Date; // Fecha de autorización de entrega

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepairProductDto)
  products: RepairProductDto[]; // Productos a reparar

  @IsOptional()
  @IsString()
  observations?: string; // Observaciones generales de la orden

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // Imágenes opcionales

  @IsNotEmpty()
  @IsMongoId()
  receivedBy: Types.ObjectId; // Empleado que recibe el producto

  @IsNotEmpty()
  @IsString()
  deliveryRepresentative: string; // Empleado responsable de la orden

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus; // Estado de la orden

  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId; // Empleado que creó la orden

  @IsOptional()
  @IsMongoId()
  updatedBy?: Types.ObjectId; // Empleado que actualizó la orden
}
