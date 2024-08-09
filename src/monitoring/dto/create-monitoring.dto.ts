import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ActivityDto {
  @IsString()
  @IsOptional()
  activityType: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsOptional()
  sourcePath?: string;

  @IsString()
  @IsNotEmpty()
  destinationPath: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  fileType?: string;
}

export class CreateMonitoringDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  computerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  activities: ActivityDto[];

  @IsString()
  @IsOptional()
  fileHash?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
