import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Employee } from '../schemas/employee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Employee.name) private userModel: Model<Employee>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<Employee> {
    const { id } = payload;

    const employee = await this.userModel.findById(id);

    if (!employee) {
      throw new UnauthorizedException('Token no es valido');
    }
    if (!employee.status) {
      throw new UnauthorizedException(
        'El empleado está dado de baja, habla con el admin',
      );
    }

    return employee;
  }
}
