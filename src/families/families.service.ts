import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from './schemas/family.schema';
import mongoose, { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import { Category } from 'src/categories/schemas/category.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectModel(Family.name) private familyModel: Model<Family>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Specification.name)
    private specificationModel: Model<Specification>,
  ) {}
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
  /*Se repite como tres veces xd */
  async remove(id: string) {
    try {
      validateId(id);
      const familyDeleted = await this.familyModel.findByIdAndDelete(id).exec();
      const categories = await this.categoryModel.find({ familyId: id });
      const categoryIds = categories.map((category) => category._id.toString());
      await this.categoryModel
        .deleteMany({
          _id: {
            $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
      const subcategories = await this.subcategoryModel.find({
        familyId: id,
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
        familyId: id,
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
      ifNotFound({ entity: familyDeleted, id });
      return familyDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
