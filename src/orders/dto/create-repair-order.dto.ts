import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsArray,
  IsDate,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RepairProductDto } from './repair-product.dto';
import { Types } from 'mongoose';
import { OrderStatus } from './create-order.dto';

export class CreateRepairOrderDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  quotationDeliveryDate: Date; // Fecha de entrega de la cotización (obligatoria)

  @IsNotEmpty()
  @IsMongoId()
  technician: Types.ObjectId; // ID del técnico que repara el producto (obligatorio)

  @IsNotEmpty()
  @IsString()
  damagedPartsImageUrl: string; // URL de la imagen de las piezas dañadas (obligatorio)

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepairProductDto)
  products: RepairProductWithDiagnosticsDto[]; // Productos a reparar con diagnósticos específicos (obligatorio)
}

// DTO para productos, extendido para incluir diagnóstico obligatorio
export class RepairProductWithDiagnosticsDto extends RepairProductDto {
  @IsNotEmpty()
  @IsString()
  diagnostic: string; // Diagnóstico específico del producto (obligatorio)

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus; // Estado de la orden

  @IsNotEmpty()
  @IsMongoId()
  updatedBy?: Types.ObjectId; // Empleado que generó la orden de reparación
}
