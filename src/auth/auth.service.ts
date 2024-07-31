import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { LoginUserDto, UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { handleDBErrors } from 'src/handlers/error.handle';
@Injectable()
export class AuthService {
  private ROLE = 'role';
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...UserData } = createUserDto;
      const createdUser = new this.userModel({
        ...UserData,
        password: await bcrypt.hashSync(password, 10),
      });

      await createdUser.save();

      const user = await this.userModel
        .findById(createdUser._id)
        .populate(this.ROLE)
        .exec();
      // Exclude password from the response
      user.password = undefined;

      return {
        user,
        token: this.getJwtToken({ id: user._id.toString(), user }),
      };
      // TODO: Return a JWT token
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().populate(this.ROLE).exec();
  }

  async getUser(id: string): Promise<User> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario no válido');
      }
      const userFound = await this.userModel
        .findById(id)
        .populate(this.ROLE)
        .exec();
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

      const { password, ...userData } = updateUserDto;
      const user: any = { ...userData };

      if (password) {
        user.password = bcrypt.hashSync(password, 10);
      }

      const userUpdated = await this.userModel
        .findByIdAndUpdate(id, user, {
          new: true,
        })
        .populate(this.ROLE)
        .exec();

      if (!userUpdated) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return userUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .populate(this.ROLE)
      .exec();
    if (!deletedUser) throw new NotFoundException('Usuario no encontrado');
    return deletedUser;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Find user by email and select the password and email
    const user = await this.userModel
      .findOne({ email })
      .populate(this.ROLE)
      .select('password email _id role fullName imageUrl')
      .exec();

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
      token: this.getJwtToken({ id: id, user }),
    };
    // TODO: Return a JWT token
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
