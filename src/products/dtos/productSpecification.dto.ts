import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ProductSpecificationDto {
  @IsNotEmpty()
  @IsMongoId()
  specification: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  value: string;
}
