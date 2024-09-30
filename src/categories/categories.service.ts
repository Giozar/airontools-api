import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import {
  CategoryQueriesDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto';
import { ProductsService } from 'src/products/products.service';
import { SpecificationsService } from 'src/specifications/specifications.service';
import { SubcategoriesService } from 'src/subcategories/subcategories.service';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class CategoriesService {
  private FAMILY = 'family';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly subcategoriesService: SubcategoriesService,
    private readonly specificationsService: SpecificationsService,
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
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
    if (query.family) filter.family = query.family;
    return await this.categoryModel
      .find(filter)
      .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
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

  async findAllByFamilyId(id: string) {
    try {
      const categorySearched = await this.categoryModel
        .find({ family: id })
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      return categorySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
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
      const categoryDeleted = await this.categoryModel
        .findByIdAndDelete(id)
        .populate([this.FAMILY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: categoryDeleted, id });
      if (categoryDeleted.images.length > 0) {
        if (process.env.STORAGE === 'S3') {
          await Promise.all(
            categoryDeleted.images.map((image) =>
              this.filesService.deleteFileS3(image),
            ),
          );
        } else {
          await Promise.all(
            categoryDeleted.images.map((image) =>
              this.filesService.deleteFile(image),
            ),
          );
        }
      }
      validateId(id);
      this.subcategoriesService.removeByCategoryId(id);
      this.specificationsService.removeByCategoryId(id);
      this.productsService.removeByCategoryId(id);
      return categoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      const categoryDeleted = await this.categoryModel
        .find({ family: id })
        .deleteMany({ family: id })
        .exec();
      return categoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async countByFamilyId(family: string): Promise<number> {
    return this.categoryModel.countDocuments({ family });
  }
}
