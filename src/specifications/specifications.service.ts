import { Injectable } from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Specification } from './schemas/specification.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';

@Injectable()
export class SpecificationsService {
  constructor(
    @InjectModel(Specification.name)
    private specificationModel: Model<Specification>,
  ) {}
  async create(createSpecificationDto: CreateSpecificationDto) {
    try {
      const specification = new this.specificationModel(createSpecificationDto);
      return await specification.save();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.specificationModel.find();
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const specificationSearched = await this.specificationModel.findById(id);
      ifNotFound({ entity: specificationSearched, id });
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateSpecificationDto: UpdateSpecificationDto) {
    try {
      validateId(id);

      const specificationUpdated =
        await this.specificationModel.findByIdAndUpdate(
          id,
          updateSpecificationDto,
        );
      ifNotFound({ entity: specificationUpdated, id });
      return specificationUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      validateId(id);
      const specificationDeleted = await this.specificationModel
        .findByIdAndDelete(id)
        .exec();
      ifNotFound({ entity: specificationDeleted, id });
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      validateId(id);
      const specificationDeleted = await this.specificationModel
        .find({ familyId: id })
        .deleteMany({ familyId: id })
        .exec();
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: string) {
    try {
      validateId(id);
      const specificationDeleted = await this.specificationModel
        .find({ categoryId: id })
        .deleteMany({ categoryId: id })
        .exec();
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeBySubcategoryId(id: string) {
    try {
      validateId(id);
      const specificationDeleted = await this.specificationModel
        .find({ subcategoryId: id })
        .deleteMany({ subcategoryId: id })
        .exec();
      ifNotFound({ entity: specificationDeleted, id });
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
