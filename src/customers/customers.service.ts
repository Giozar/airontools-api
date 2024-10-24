import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import Fuse from 'fuse.js';
import { SearchCustomerParams } from './dto/search-customer.dto';

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

  async searchCustomer({
    keywords = '',
    limit = 10,
    offset = 0,
    company = '',
    customerType = '',
  }: SearchCustomerParams): Promise<Customer[]> {
    const query: any = {};

    // Aplicamos filtro por company si está presente
    if (company) {
      query.company = company;
    }

    if (customerType) {
      query.customerType = customerType;
    }

    // Si no hay palabras clave, devolver clientes filtrados por company/customerType con paginación
    if (!keywords.trim()) {
      return this.customerModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
    }

    // Obtener los clientes que cumplen con los filtros de company y customerType
    const customers = await this.customerModel.find(query).exec();

    // Configurar Fuse.js
    const fuse = new Fuse(customers, {
      keys: ['name'],
      threshold: 0.4, // Ajusta este valor para más o menos tolerancia
      minMatchCharLength: 2, // Mínimo de caracteres para empezar a buscar
    });

    // Realizar la búsqueda difusa
    const results = fuse.search(keywords.trim());

    // Mapear los resultados para obtener los clientes
    const customersFound = results.map((result) => result.item);

    // Aplicar paginación manualmente
    const paginatedResults = customersFound.slice(offset, offset + limit);

    return paginatedResults;
  }

  // async searchCustomer(
  //   keywords: string = '',
  //   limit: number = 10,
  //   offset: number = 0,
  // ): Promise<any> {
  //   const customersFound: Customer[] = [];

  //   // Si no hay palabras clave, devolver paginación básica con populate
  //   if (!keywords.trim()) {
  //     return this.customerModel
  //       .find()
  //       .sort({ createdAt: -1 }) // Ordenar por fecha de creación
  //       .skip(offset)
  //       .limit(limit)
  //       .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
  //       .exec();
  //   }

  //   const keywordArray = keywords.split(' ').filter((k) => k.trim());

  //   for (const keyword of keywordArray) {
  //     const customers = await this.customerModel
  //       .find({
  //         name: { $regex: keyword, $options: 'i' }, // Buscar por nombre
  //       })
  //       .limit(limit)
  //       .skip(offset)
  //       .sort({ createdAt: -1 }) // Ordenar por fecha de creación
  //       .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
  //       .exec();

  //     if (customers.length > 0) {
  //       customersFound.push(...customers);
  //     }
  //   }

  //   return customersFound;
  // }

  // Encontrar un clientes por id de empresa
  async findAllByCompanyId(company: string) {
    try {
      const customers = await this.customerModel.find({ company: company });
      return customers;
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
