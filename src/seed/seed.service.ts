import { handleDBErrors } from 'src/handlers';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class SeedService {
  private role = {
    name: 'Administrador',
    description: 'Es el rol del administrador semilla',
    createdBy: new Types.ObjectId(),
  };

  private user = {
    email: 'root@root.com',
    password: 'Root123',
    name: 'root',
    createdBy: new Types.ObjectId(),
  };

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async executeSeed() {
    try {
      // Buscar si el rol "Administrador" ya existe
      let adminRole = await this.roleModel.findOne({ name: this.role.name });

      if (!adminRole) {
        // Si no existe, crear el rol
        adminRole = await this.roleModel.create(this.role);
      }

      // Asignar el rol al usuario
      const user = {
        ...this.user,
        role: adminRole._id,
        password: await bcrypt.hashSync(this.user.password, 10),
      };

      // Crear el usuario
      await this.userModel.create(user);

      return 'Semilla cultivada con éxito';
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
