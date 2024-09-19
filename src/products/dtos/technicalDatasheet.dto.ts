import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TechnicalDatasheetDto {
  @IsNotEmpty()
  @IsString()
  url: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  date: string;
}
