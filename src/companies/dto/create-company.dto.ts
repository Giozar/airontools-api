import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEmail,
  IsPhoneNumber,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Nombre de la empresa

  @IsOptional()
  @IsString()
  industry?: string; // Industria a la que pertenece la empresa

  @IsOptional()
  @IsEmail()
  email?: string; // Correo electrónico de contacto de la empresa

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string; // Número de teléfono de la empresa

  @IsOptional()
  @IsString()
  website?: string; // Sitio web de la empresa

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addresses?: string[]; // Direcciones de la empresa (puede tener más de una)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contacts?: string[]; // Nombres de contactos adicionales dentro de la empresa

  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  updatedBy: Types.ObjectId;
}
