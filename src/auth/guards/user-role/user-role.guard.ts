import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

import { User } from 'src/auth/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] =
      this.reflector.get<string[]>(META_ROLES, context.getHandler()) || [];

    if (validRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userRole = await this.roleModel.findById(user.role).exec();

    if (!userRole) {
      throw new BadRequestException('Role not found');
    }

    if (validRoles.includes(userRole.name)) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs roles: [${validRoles}]`,
    );
  }
}
