import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/employee.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { handleDBErrors } from 'src/auth/handlers/auth.errors';

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
