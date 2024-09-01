import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from './schemas/subcategory.schema';
import { Model, Types } from 'mongoose';
import { handleDBErrors, ifNotFound } from 'src/handlers';
import {
  CreateSubcategoryDto,
  SubcategoryQueriesDto,
  UpdateSubcategoryDto,
} from './dto';
@Injectable()
export class SubcategoriesService {
  private FAMILY = 'family';
  private CATEGORY = 'category';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
  ) {}
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const createdSubcategory = new this.subcategoryModel(
        createSubcategoryDto,
      );
      await createdSubcategory.save();

      const subcategory = this.subcategoryModel
        .findById(createdSubcategory._id)
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();

      return subcategory;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(query: SubcategoryQueriesDto) {
    const filter: any = {};
    if (query.category) filter.category = query.category;
    return await this.subcategoryModel
      .find(filter)
      .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
      const subcategorySearched = await this.subcategoryModel
        .findById(id)
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: subcategorySearched, id });
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      const subcategoryUpdated = await this.subcategoryModel
        .findByIdAndUpdate(id, updateSubcategoryDto)
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: subcategoryUpdated, id });
      return subcategoryUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const subcategoryDeleted = await this.subcategoryModel
        .findByIdAndDelete(id)
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: subcategoryDeleted, id });
      return subcategoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: Types.ObjectId) {
    try {
      const subcategoriesDeleted = await this.subcategoryModel
        .find({ family: id })
        .deleteMany({ family: id })
        .exec();
      return subcategoriesDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: Types.ObjectId) {
    try {
      const subcategoriesDeleted = await this.subcategoryModel
        .find({ category: id })
        .deleteMany({ category: id })
        .exec();
      return subcategoriesDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(family: Types.ObjectId): Promise<number> {
    return this.subcategoryModel.countDocuments({ family });
  }
  async countByCategoryId(category: Types.ObjectId): Promise<number> {
    return this.subcategoryModel.countDocuments({ category });
  }
}
