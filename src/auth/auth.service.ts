import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from './handlers/auth.errors';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUser: CreateUserDto) {
    try {
      const newUser = new this.userModel(createUser);
      await newUser.save();
      return { message: 'User created successfully!', user: newUser };
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
