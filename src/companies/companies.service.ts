import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const companyCreated = new this.companyModel(createCompanyDto);
      await companyCreated.save;
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
