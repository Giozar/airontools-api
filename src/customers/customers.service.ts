import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customer.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import { levenshteinDistance } from 'src/utils/levenshteinDistance';
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
    maxDistance = 3,
    autocomplete = false,
  }: SearchCustomerParams): Promise<any> {
    const exactMatches: Customer[] = [];
    const approximateMatches: Customer[] = [];
    const query: any = {};

    // Aplicamos filtro por company si está presente
    if (company) {
      query.company = company;
    }

    // Si no hay palabras clave, devolver paginación básica
    if (!keywords.trim() && !autocomplete) {
      return (
        this.customerModel
          .find(query)
          .sort({ createdAt: -1 }) // Ordenar por fecha de creación
          .skip(offset)
          .limit(limit)
          // .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
          .exec()
      );
    }

    const keywordArray = keywords.split(' ').filter((k) => k.trim());

    // Obtener todos los clientes limitados por paginación y aplicar filtro de company
    const allCustomers = await this.customerModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate(['createdBy', 'updatedBy'])
      .exec();

    // Filtrar clientes utilizando coincidencias exactas o la distancia de Levenshtein
    for (const customer of allCustomers) {
      const nameParts = customer.name.toLowerCase().split(' '); // Dividimos el nombre en partes
      let matchFound = false;

      for (const keyword of keywordArray) {
        const loweredKeyword = keyword.toLowerCase();

        // Comprobamos cada parte del nombre
        for (const part of nameParts) {
          const distance = levenshteinDistance(part, loweredKeyword);

          // Coincidencia directa (keyword coincide exactamente con alguna parte del nombre)
          if (part === loweredKeyword) {
            exactMatches.push(customer);
            matchFound = true;
            break; // No necesitamos seguir si ya encontramos coincidencia exacta
          }

          // Coincidencia aproximada usando Levenshtein
          if (!matchFound && distance <= maxDistance) {
            approximateMatches.push(customer);
            matchFound = true;
            break;
          }
        }

        if (matchFound) break; // Si ya encontramos coincidencia, pasamos al siguiente cliente
      }
    }

    // Unir coincidencias exactas y aproximadas, dando prioridad a las exactas
    const customersFound = [...exactMatches, ...approximateMatches];

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
