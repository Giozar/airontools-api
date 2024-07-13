import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsInt,
  IsArray,
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
  ValidateNested,
} from 'class-validator';

// Decorador personalizado para validar un objeto con campos variables

function IsVariableObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVariableObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value && typeof value === 'object'; // Valida que sea un objeto
        },
        defaultMessage(args: ValidationArguments) {
          return 'Each item in the array must be an object';
        },
      },
    });
  };
}

export class CreateProductDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId?: number;

  @IsNotEmpty()
  @IsNumber()
  subcategoryId?: number;

  @IsOptional()
  @IsNumber()
  subsubcategoryId?: number;

  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsString()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsVariableObject({ each: true }) // Usa el decorador personalizado
  @IsArray()
  specifications: Array<Record<string, any>>;
}
