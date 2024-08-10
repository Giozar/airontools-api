import { handleDBErrors } from 'src/handlers';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class SeedService {
  private role;
  private user;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {
    this.role = {
      name: 'Administrador',
      description: 'Es el rol del administrador semilla',
      createdBy: new Types.ObjectId(),
    };
  }

  async executeSeed() {
    try {
      const createdRole = new this.roleModel(this.role);
      await createdRole.save();

      // console.log(createdRole);

      this.user = {
        email: 'root@root.com',
        password: 'Root123',
        name: 'root',
        role: createdRole._id,
        createdBy: new Types.ObjectId(),
      };
      const createdUser = new this.userModel({
        ...this.user,
        password: await bcrypt.hashSync(this.user.password, 10),
      });

      await createdUser.save();

      // console.log(createdUser);

      return 'Semilla cultivada con éxito';
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
