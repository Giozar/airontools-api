import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { handleDBErrors } from './handlers/auth.errors';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { LoginUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...UserData } = createUserDto;
      const user = new this.userModel({
        ...UserData,
        password: await bcrypt.hashSync(password, 10),
      });

      await user.save();

      // Exclude password from the response
      user.password = undefined;

      return {
        user,
        token: this.getJwtToken({ id: user._id.toString() }),
      };
      // TODO: Return a JWT token
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUser(id: string): Promise<User> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario no válido');
      }
      const userFound = await this.userModel.findById(id);
      if (!userFound) throw new NotFoundException('Usuario no encontrado');
      return userFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario no válido');
      }
      const { password, ...UserData } = updateUserDto;
      const user = {
        ...UserData,
        password: await bcrypt.hashSync(password, 10),
      };
      const userUpdated = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      if (!userUpdated) throw new NotFoundException('Usuario no encontrado');
      return userUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndDelete({ _id: id })
      .exec();
    if (!deletedUser) throw new NotFoundException('Usuario no encontrado');
    return deletedUser;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Find user by email and select the password and email
    const user = await this.userModel
      .findOne({ email })
      .select('password email _id roles fullName');

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales invalidas (email es incorrecto)',
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(
        'Credenciales invalidas (contraseña incorrecta)',
      );
    }
    // Extract the user _id and return a string
    const id = user._id.toString();
    return {
      user,
      token: this.getJwtToken({ id: id }),
    };
    // TODO: Return a JWT token
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
