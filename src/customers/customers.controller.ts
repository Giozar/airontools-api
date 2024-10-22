import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchCustomerDto } from './dto/search-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get('company/:companyId')
  findAllByCompanyId(@Param('companyId') companyId: string) {
    return this.customersService.findAllByCompanyId(companyId);
  }

  @Post('search')
  async searchCustomer(
    @Body() search: SearchCustomerDto,
    @Query() { limit, offset }: PaginationDto,
  ) {
    const response = await this.customersService.searchCustomer(
      search.keywords,
      limit,
      offset,
      search.companyId,
      3,
      search.autocomplete,
    );
    return response;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
