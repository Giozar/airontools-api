import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from './schemas/family.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';

@Injectable()
export class FamiliesService {
  constructor(@InjectModel(Family.name) private familyModel: Model<Family>) {}
  async create(createFamilyDto: CreateFamilyDto) {
    try {
      const family = new this.familyModel(createFamilyDto);
      return await family.save();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.familyModel.find();
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const familySearched = await this.familyModel.findById(id);
      ifNotFound({ entity: familySearched, id });
      return familySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    try {
      validateId(id);

      const familyUpdated = await this.familyModel.findByIdAndUpdate(
        id,
        updateFamilyDto,
      );
      ifNotFound({ entity: familyUpdated, id });
      return familyUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      validateId(id);
      const familyDeleted = await this.familyModel.findByIdAndDelete(id).exec();
      ifNotFound({ entity: familyDeleted, id });
      return familyDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
