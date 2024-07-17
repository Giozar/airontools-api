import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.getRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.getRole(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
}
