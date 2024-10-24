import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import Fuse from 'fuse.js';
import { SearchCompanyParams } from './dto/search-companies.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const companyCreated = new this.companyModel(createCompanyDto);
      await companyCreated.save();
      return companyCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    try {
      const companiesFound = await this.companyModel.find();
      return companiesFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async searchCompany({
    keywords = '',
    limit = 10,
    offset = 0,
  }: SearchCompanyParams): Promise<Company[]> {
    if (!keywords.trim()) {
      // Devolver empresas sin filtrar con paginación
      return this.companyModel
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate(['createdBy', 'updatedBy'])
        .exec();
    }

    // Obtener todas las empresas necesarias para la búsqueda
    const allCompanies = await this.companyModel
      .find()
      .populate(['createdBy', 'updatedBy'])
      .exec();

    // Configurar Fuse.js
    const fuse = new Fuse(allCompanies, {
      keys: ['name'],
      threshold: 0.4, // Ajusta este valor para más o menos tolerancia
      minMatchCharLength: 2, // Mínimo de caracteres para empezar a buscar
    });

    // Realizar la búsqueda difusa
    const results = fuse.search(keywords.trim());

    // Mapear los resultados para obtener las empresas
    const companiesFound = results.map((result) => result.item);

    // Aplicar paginación manualmente
    const paginatedResults = companiesFound.slice(offset, offset + limit);

    return paginatedResults;
  }

  // async searchCompany(
  //   keywords: string = '',
  //   limit: number = 10,
  //   offset: number = 0,
  // ): Promise<any> {
  //   const companiesFound: Company[] = [];

  //   // Si no hay palabras clave, devolver paginación básica con populate
  //   if (!keywords.trim()) {
  //     return this.companyModel
  //       .find()
  //       .sort({ createdAt: -1 }) // Ordenar por fecha de creación
  //       .skip(offset)
  //       .limit(limit)
  //       .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
  //       .exec();
  //   }

  //   const keywordArray = keywords.split(' ').filter((k) => k.trim());

  //   for (const keyword of keywordArray) {
  //     const companies = await this.companyModel
  //       .find({
  //         name: { $regex: keyword, $options: 'i' }, // Buscar por nombre
  //       })
  //       .limit(limit)
  //       .skip(offset)
  //       .sort({ createdAt: -1 }) // Ordenar por fecha de creación
  //       .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
  //       .exec();

  //     if (companies.length > 0) {
  //       companiesFound.push(...companies);
  //     }
  //   }

  //   return companiesFound;
  // }

  async findOne(id: string) {
    try {
      const company = await this.companyModel.findById(id);
      return company;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const companyUpdated = await this.companyModel.findByIdAndUpdate(
        id,
        updateCompanyDto,
        { new: true },
      );
      return companyUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const companyRemoved = await this.companyModel.findByIdAndDelete(id);
      return companyRemoved;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
