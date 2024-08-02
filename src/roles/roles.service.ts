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
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const createdRole = new this.roleModel(createRoleDto);
      await createdRole.save();
      const role = this.roleModel
        .findById(createdRole._id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();

      return role;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel
      .find()
      .populate([this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID del rol no válido');
      }
      const roleFound = await this.roleModel
        .findById(id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      if (!roleFound) throw new NotFoundException('Rol no encontrado');
      return roleFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID del rol no válido');
      }

      const roleUpdated = await this.roleModel
        .findByIdAndUpdate(id, updateRoleDto, {
          new: true,
        })
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      if (!roleUpdated) throw new NotFoundException('Rol no encontrado');
      return roleUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const roleDeleted = await this.roleModel
      .findByIdAndDelete({ _id: id })
      .populate([this.CREATEDBY, this.UPDATEDBY])
      .exec();
    if (!roleDeleted) throw new NotFoundException('Rol no encontrado');
    return roleDeleted;
  }
}
