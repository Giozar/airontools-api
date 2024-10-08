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
  REPAIR = 'repair',
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  customer: Types.ObjectId; // Relación con el cliente (CustomerDto)

  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType; // Tipo de orden (en este caso, 'repair')

  @IsOptional()
  authorizationDate: Date; // Fecha de creación de la orden

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
  @ValidateNested()
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
