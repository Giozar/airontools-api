import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from './schemas/subcategory.schema';
import mongoose, { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import {
  CreateSubcategoryDto,
  SubcategoryQueriesDto,
  UpdateSubcategoryDto,
} from './dto';
import { Specification } from 'src/specifications/schemas/specification.schema';
@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Specification.name)
    private specificationModel: Model<Specification>,
  ) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const subcategory = new this.subcategoryModel(createSubcategoryDto);
      return await subcategory.save();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(query: SubcategoryQueriesDto) {
    const filter: any = {};
    if (query.categoryId) filter.categoryId = query.categoryId;
    return await this.subcategoryModel.find(filter);
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const subcategorySearched = await this.subcategoryModel.findById(id);
      ifNotFound({ entity: subcategorySearched, id });
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      validateId(id);

      const subcategoryUpdated = await this.subcategoryModel.findByIdAndUpdate(
        id,
        updateSubcategoryDto,
      );
      ifNotFound({ entity: subcategoryUpdated, id });
      return subcategoryUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      validateId(id);
      const subcategoryDeleted = await this.subcategoryModel
        .findByIdAndDelete(id)
        .exec();
      const specifications = await this.specificationModel.find({
        subcategoryId: id,
      });
      const specificationsIds = specifications.map((specs) =>
        specs._id.toString(),
      );
      await this.specificationModel
        .deleteMany({
          _id: {
            $in: specificationsIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
      ifNotFound({ entity: subcategoryDeleted, id });
      return subcategoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      validateId(id);
      const subcategoriesDeleted = await this.subcategoryModel
        .find({ familyId: id })
        .deleteMany({ familyId: id })
        .exec();
      return subcategoriesDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: string) {
    try {
      validateId(id);
      const subcategoriesDeleted = await this.subcategoryModel
        .find({ categoryId: id })
        .deleteMany({ categoryId: id })
        .exec();
      return subcategoriesDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(familyId: string): Promise<number> {
    return this.subcategoryModel.countDocuments({ familyId });
  }
  async countByCategoryId(categoryId: string): Promise<number> {
    return this.subcategoryModel.countDocuments({ categoryId });
  }
}
