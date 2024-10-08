import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export class AddressDto {
  @IsOptional()
  @IsString()
  street?: string; // Opcional

  @IsOptional()
  @IsString()
  city?: string; // Opcional

  @IsOptional()
  @IsString()
  state?: string; // Opcional

  @IsOptional()
  @IsString()
  postalCode?: string; // Opcional

  @IsOptional()
  @IsString()
  country?: string; // Opcional
}

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsEnum(CustomerType)
  customerType: CustomerType; // Tipo de cliente: individuo o empresa

  @IsNotEmpty()
  @IsString()
  name: string; // Nombre del cliente (nombre completo o nombre de la empresa)

  @IsOptional()
  @IsMongoId()
  company?: Types.ObjectId; // Solo si el cliente es una empresa

  @IsOptional()
  @IsEmail()
  email?: string; // Correo electrónico del cliente

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string; // Teléfono de contacto (requerido)

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto; // Dirección del cliente (opcional)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalContacts?: string[]; // Contactos adicionales, si los hay

  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  updatedBy?: Types.ObjectId; // Opcional
}
