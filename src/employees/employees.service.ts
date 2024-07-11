import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/employee.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { handleDBErrors } from 'src/auth/handlers/auth.errors';
import { LoginEmployeeDto } from './dto/login-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    try {
      const { password, ...EmployeeData } = createEmployeeDto;
      const newEmployee = new this.employeeModel({
        ...EmployeeData,
        password: await bcrypt.hashSync(password, 10),
      });

      await newEmployee.save();

      return {
        ...newEmployee,
        token: this.getJwtToken({ id: newEmployee._id.toString() }),
      };
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async loginEmployee(loginEmployeeDto: LoginEmployeeDto) {
    const { password, email } = loginEmployeeDto;

    const employee = await this.employeeModel
      .findOne({ email })
      .select('password email _id');

    if (!employee) {
      throw new UnauthorizedException(
        'Credentials are invalid (email is incorrect)',
      );
    }

    if (!bcrypt.compareSync(password, employee.password)) {
      throw new UnauthorizedException(
        'Credentials are invalid (password is incorrect)',
      );
    }

    const employeeId = employee._id.toString();

    return {
      ...employee,
      token: this.getJwtToken({ id: employeeId }),
    };
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee ${updateEmployeeDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
