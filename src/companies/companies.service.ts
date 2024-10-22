import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import { levenshteinDistance } from 'src/utils/levenshteinDistance';

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

  async searchCompany(
    keywords: string = '',
    limit: number = 10,
    offset: number = 0,
    maxDistance: number = 3, // Distancia máxima de Levenshtein
    autocomplete: boolean = false, // Si se busca en un input autocomplete, para no mostrar todo
  ): Promise<any> {
    const companiesFound: Company[] = [];

    // Si no hay palabras clave, devolver paginación básica con populate
    if (!keywords.trim() && !autocomplete) {
      return this.companyModel
        .find()
        .sort({ createdAt: -1 }) // Ordenar por fecha de creación
        .skip(offset)
        .limit(limit)
        .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
        .exec();
    }

    // Obtener todas las empresas, limitada por paginación para controlar rendimiento
    const allCompanies = await this.companyModel
      .find()
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación
      .skip(offset)
      .limit(limit)
      .populate(['createdBy', 'updatedBy']) // Popula entidades relacionadas
      .exec();

    const keywordArray = keywords.split(' ').filter((k) => k.trim());

    // Comparar cada empresa con las palabras clave usando Levenshtein
    for (const company of allCompanies) {
      for (const keyword of keywordArray) {
        const distance = levenshteinDistance(
          company.name.toLowerCase(),
          keyword.toLowerCase(),
        );
        if (distance <= maxDistance) {
          companiesFound.push(company);
          break; // Si ya encontramos una coincidencia con una palabra clave, pasamos a la siguiente empresa
        }
      }
    }

    return companiesFound;
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
