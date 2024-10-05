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
} from 'class-validator';
export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string; // Opcional, en caso de que necesites registrar países diferentes
}

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsEnum(CustomerType)
  customerType: CustomerType; // Tipo de cliente: individuo o empresa

  @IsNotEmpty()
  @IsString()
  name: string; // Nombre del cliente (nombre completo o nombre de la empresa)

  @IsOptional()
  @IsString()
  companyName?: string; // Solo si el cliente es una empresa

  @IsOptional()
  @IsEmail()
  email?: string; // Correo electrónico del cliente

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string; // Teléfono de contacto

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto; // Dirección del cliente

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalContacts?: string[]; // Contactos adicionales, si los hay
}
