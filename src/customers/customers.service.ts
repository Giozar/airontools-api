import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<Customer>,
  ) {}

  // Crear un nuevo cliente
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customerCreated = new this.customerModel(createCustomerDto);
      await customerCreated.save();
      return customerCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Encontrar todos los clientes
  async findAll() {
    try {
      const customersFound = await this.customerModel.find();
      return customersFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Encontrar un cliente por su ID
  async findOne(id: string) {
    try {
      const customer = await this.customerModel.findById(id);
      return customer;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Actualizar un cliente por su ID
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customerUpdated = await this.customerModel.findByIdAndUpdate(
        id,
        updateCustomerDto,
        { new: true }, // Devolver el documento actualizado
      );
      return customerUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Eliminar un cliente por su ID
  async remove(id: string) {
    try {
      const customerRemoved = await this.customerModel.findByIdAndDelete(id);
      return customerRemoved;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
