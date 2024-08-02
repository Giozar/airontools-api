import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from './schemas/family.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';

@Injectable()
export class FamiliesService {
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(@InjectModel(Family.name) private familyModel: Model<Family>) {}
  async create(createFamilyDto: CreateFamilyDto) {
    try {
      const createdFamily = new this.familyModel(createFamilyDto);
      await createdFamily.save();
      const family = this.familyModel
        .findById(createdFamily._id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      return family;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.familyModel
      .find()
      .populate([this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const familySearched = await this.familyModel
        .findById(id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: familySearched, id });
      return familySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    try {
      validateId(id);

      const familyUpdated = await this.familyModel
        .findByIdAndUpdate(id, updateFamilyDto)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: familyUpdated, id });
      return familyUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      validateId(id);
      const familyDeleted = await this.familyModel
        .findByIdAndDelete(id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: familyDeleted, id });
      return familyDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
