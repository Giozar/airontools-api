import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { handleDBErrors } from './handlers/auth.errors';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...UserData } = createUserDto;
      const newUser = new this.userModel({
        ...UserData,
        password: await bcrypt.hashSync(password, 10),
      });

      await newUser.save();

      // Exclude password from the response
      newUser.password = undefined;

      return { message: 'User created successfully!', user: newUser };
      // TODO: Return a JWT token
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
