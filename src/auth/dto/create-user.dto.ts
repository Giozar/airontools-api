import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsMongoId()
  @IsOptional()
  role: Types.ObjectId;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsMongoId()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  updatedBy: Types.ObjectId;
}
