import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { ValidRoles } from './interfaces';
import { Employee } from './schemas/employee.schema';
import { Auth, GetEmployee, RawHeaders } from './decorators';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('register')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto);
  }

  @Post('login')
  loginEmployeee(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeesService.loginEmployee(loginEmployeeDto);
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  adminRoute(@GetEmployee() employee: Employee) {
    return {
      ok: true,
      message: 'This is a private route',
      employee,
    };
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetEmployee() employee: Employee,
    @GetEmployee('email') email: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log({ user: request.user });
    // console.log({ user });
    // console.log({ email });
    return {
      ok: true,
      message: 'This is a private route',
      employee,
      email,
      headers,
    };
  }
}
