import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  @IsOptional()
  permissions: object;

  @IsString()
  createdBy: string;

  @IsString()
  @IsOptional()
  updatedBy: string;
}
