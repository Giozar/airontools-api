import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import {
  CategoryQueriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';

@Injectable()
export class CategoriesService {
  private FAMILY = 'family';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Specification.name)
    private specificationModel: Model<Specification>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      await createdCategory.save();

      const category = this.categoryModel
        .findById(createdCategory._id)
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();

      return category;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll(query: CategoryQueriesDto) {
    const filter: any = {};
    if (query.familyId) filter.familyId = query.familyId;
    return await this.categoryModel
      .find(filter)
      .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const categorySearched = await this.categoryModel
        .findById(id)
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: categorySearched, id });
      return categorySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      validateId(id);

      const categoryUpdated = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto)
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: categoryUpdated, id });
      return categoryUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      validateId(id);
      const categoryDeleted = await this.categoryModel
        .findByIdAndDelete(id)
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();

      const subcategories = await this.subcategoryModel.find({
        categoryId: id,
      });
      const subcategoryIds = subcategories.map((subcategory) =>
        subcategory._id.toString(),
      );
      await this.subcategoryModel
        .deleteMany({
          _id: {
            $in: subcategoryIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
      const specifications = await this.specificationModel.find({
        categoryId: id,
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
      ifNotFound({ entity: categoryDeleted, id });
      return categoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      validateId(id);
      const categoryDeleted = await this.categoryModel
        .find({ familyId: id })
        .deleteMany({ familyId: id })
        .exec();
      return categoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(familyId: string): Promise<number> {
    return this.categoryModel.countDocuments({ familyId });
  }
}
