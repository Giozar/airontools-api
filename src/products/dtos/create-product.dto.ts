import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  familyId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @IsOptional()
  @IsString()
  imagesUrl: [];

  @IsOptional()
  @IsString()
  manuals: [];

  @IsOptional()
  @IsString()
  videos: [string];

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  characteristics: string;

  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsVariableObject({ each: true }) // Usa el decorador personalizado
  @IsArray()
  specifications: Array<Record<string, any>>;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsOptional()
  updatedBy: string;
}
