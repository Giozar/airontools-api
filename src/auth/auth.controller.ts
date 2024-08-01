import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  Delete,
  Param,
  Patch,
  // SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './schemas/user.schema';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log({ user: request.user });
    // console.log({ user });
    // console.log({ email });
    return {
      ok: true,
      message: 'This is a private route',
      user,
      email,
      headers,
    };
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin', 'user'])
  @RoleProtected(ValidRoles.admin, ValidRoles.employee, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a private route',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a private route',
      user,
    };
  }
}
