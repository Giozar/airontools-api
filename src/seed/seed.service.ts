import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { handleDBErrors } from 'src/handlers';

@Injectable()
export class SeedService {
  private readonly adminRole = {
    name: 'Administrador',
    description: 'Es el rol del administrador semilla',
    createdBy: new Types.ObjectId(),
  };

  private readonly adminUser = {
    email: 'root@root.com',
    password: 'Root123',
    name: 'root',
    createdBy: new Types.ObjectId(),
  };

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async executeSeed(): Promise<string> {
    try {
      const [existingRole, existingUser] = await Promise.all([
        this.roleModel.findOne({ name: this.adminRole.name }).exec(),
        this.userModel.findOne({ email: this.adminUser.email }).exec(),
      ]);

      if (!existingRole) {
        const createdRole = await new this.roleModel(this.adminRole).save();
        this.adminUser['role'] = createdRole._id;
      } else {
        this.adminUser['role'] = existingRole._id;
      }

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(this.adminUser.password, 10);
        await new this.userModel({
          ...this.adminUser,
          password: hashedPassword,
        }).save();
      }

      return 'Semilla cultivada con éxito';
    } catch (error) {
      handleDBErrors(error);
      throw error; // Opcionalmente, puedes volver a lanzar el error después de manejarlo.
    }
  }
}
