import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeRoleGuard } from '../guards/employee-role.guard';

export function Auth(...roles: ValidRoles[]) {
  console.log('validando...');
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), EmployeeRoleGuard),
  );
}
