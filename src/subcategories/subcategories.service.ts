import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from './schemas/subcategory.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import {
  CreateSubcategoryDto,
  SubcategoryQueriesDto,
  UpdateSubcategoryDto,
} from './dto';
import { ProductsService } from 'src/products/products.service';
import { SpecificationsService } from 'src/specifications/specifications.service';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class SubcategoriesService {
  private FAMILY = 'family';
  private CATEGORY = 'category';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    private readonly specificationsService: SpecificationsService,
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
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
      return subcategorySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllByFamilyId(id: string) {
    try {
      const subcategorySearched = await this.subcategoryModel
        .find({ family: id })
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      return subcategorySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllByCategoryId(id: string) {
    try {
      const subcategorySearched = await this.subcategoryModel
        .find({ category: id })
        .populate([this.FAMILY, this.CATEGORY, this.CREATEDBY, this.UPDATEDBY])
        .exec();
      return subcategorySearched;
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
      if (subcategoryDeleted.images.length > 0) {
        if (process.env.STORAGE === 'S3') {
          await Promise.all(
            subcategoryDeleted.images.map((image) =>
              this.filesService.deleteFileS3(image),
            ),
          );
        } else {
          await Promise.all(
            subcategoryDeleted.images.map((image) =>
              this.filesService.deleteFile(image),
            ),
          );
        }
      }
      validateId(id);
      this.specificationsService.removeBySubcategoryId(id);
      this.productsService.removeBySubcategoryId(id);
      return subcategoryDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      const subcategoriesFound = await this.findAllByFamilyId(id);
      if (subcategoriesFound && subcategoriesFound.length > 0) {
        await Promise.all(
          subcategoriesFound.map((subcategory) => this.remove(subcategory.id)),
        );
      }
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: string) {
    try {
      const subcategoriesFound = await this.findAllByCategoryId(id);
      if (subcategoriesFound && subcategoriesFound.length > 0) {
        await Promise.all(
          subcategoriesFound.map((subcategory) => this.remove(subcategory.id)),
        );
      }
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(family: string): Promise<number> {
    return this.subcategoryModel.countDocuments({ family });
  }
  async countByCategoryId(category: string): Promise<number> {
    return this.subcategoryModel.countDocuments({ category });
  }
}
