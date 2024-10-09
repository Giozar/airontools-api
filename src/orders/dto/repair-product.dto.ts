import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class RepairProductDto {
  @IsOptional()
  @IsMongoId()
  productId?: Types.ObjectId; // ID del producto si es un producto interno

  @IsNotEmpty()
  @IsString()
  brand: string; // Marca del producto, obligatorio en caso de reparación (puede ser externo o interno)

  @IsNotEmpty()
  @IsString()
  model: string; // Modelo del producto

  @IsOptional()
  @IsString()
  serialNumber?: string; // Número de serie del producto (opcional)

  @IsNotEmpty()
  @IsString()
  description: string; // Descripción del estado del producto y fallas encontradas

  @IsNotEmpty()
  quantity: number; // Cantidad de productos en la orden de reparación

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // Imágenes opcionales del producto

  @IsOptional()
  @IsString()
  observation?: string; // Observaciones adicionales específicas de este producto
}
