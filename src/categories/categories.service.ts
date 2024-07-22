import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new this.categoryModel(createCategoryDto);
      return await category.save();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    try {
      validateId(id);
      const categorySearched = await this.categoryModel.findById(id);
      ifNotFound({ entity: categorySearched, id });
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      validateId(id);

      const categoryUpdated = await this.categoryModel.findByIdAndUpdate(
        id,
        updateCategoryDto,
      );
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
        .exec();
      ifNotFound({ entity: categoryDeleted, id });
      return categoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
