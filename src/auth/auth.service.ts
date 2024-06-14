import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { handleDBErrors } from './handlers/auth.errors';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto';
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
      const newUser = new this.userModel({
        ...UserData,
        password: await bcrypt.hashSync(password, 10),
      });

      await newUser.save();

      // Exclude password from the response
      newUser.password = undefined;

      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser._id.toString() }),
      };
      // TODO: Return a JWT token
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Find user by email and select the password and email
    const user = await this.userModel
      .findOne({ email })
      .select('password email _id');

    if (!user) {
      throw new UnauthorizedException(
        'Credentials are invalid (email is incorrect)',
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(
        'Credentials are invalid (password is incorrect)',
      );
    }
    // Extract the user _id and return a string
    const userId = user._id.toString();
    return {
      ...user,
      token: this.getJwtToken({ id: userId }),
    };
    // TODO: Return a JWT token
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
