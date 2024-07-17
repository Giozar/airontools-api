import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { handleDBErrors } from 'src/handlers/error.handle';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const role = new this.roleModel(createRoleDto);
      return await role.save();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleModel.find();
  }

  async getRole(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID del rol no válido');
      }
      const roleFound = await this.roleModel.findById(id);
      if (!roleFound) throw new NotFoundException('Rol no encontrado');
      return roleFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID del rol no válido');
      }

      const roleUpdated = await this.roleModel.findByIdAndUpdate(
        id,
        updateRoleDto,
        {
          new: true,
        },
      );
      if (!roleUpdated) throw new NotFoundException('Rol no encontrado');
      return roleUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async deleteRole(id: string) {
    const roleDeleted = await this.roleModel
      .findByIdAndDelete({ _id: id })
      .exec();
    if (!roleDeleted) throw new NotFoundException('Rol no encontrado');
    return roleDeleted;
  }
}
