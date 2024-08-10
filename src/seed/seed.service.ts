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

      let roleId = existingRole ? existingRole._id : null;

      if (!existingRole) {
        // Create the role if it does not exist
        const createdRole = await new this.roleModel(this.adminRole).save();
        roleId = createdRole._id;
      }

      if (existingUser) {
        if (existingUser.role.toString() !== roleId.toString()) {
          // Update the existing user's role if it is different
          await this.userModel
            .findByIdAndUpdate(existingUser._id, { role: roleId })
            .exec();
        }
      } else {
        // Create the user if it does not exist
        const hashedPassword = await bcrypt.hash(this.adminUser.password, 10);
        await new this.userModel({
          ...this.adminUser,
          password: hashedPassword,
          role: roleId,
        }).save();
      }

      return 'Semilla cultivada con éxito';
    } catch (error) {
      handleDBErrors(error);
      throw error; // Opcionalmente, puedes volver a lanzar el error después de manejarlo.
    }
  }
}
