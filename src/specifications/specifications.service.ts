import { Injectable } from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Specification } from './schemas/specification.schema';
import { Model, Types } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import { removeProductSpecification } from './handlers/removeProductSpecification';
import { Product } from 'src/products/schemas/product.schema';

@Injectable()
export class SpecificationsService {
  private FAMILY = 'family';
  private CATEGORY = 'category';
  private SUBCATEGORY = 'subcategory';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Specification.name)
    private specificationModel: Model<Specification>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}
  async create(createSpecificationDto: CreateSpecificationDto) {
    try {
      const createdSpecification = new this.specificationModel(
        createSpecificationDto,
      );
      await createdSpecification.save();
      const specification = this.specificationModel
        .findById(createdSpecification._id)
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      return specification;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.specificationModel
      .find()
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
      ])
      .exec();
  }

  async findOne(id: string) {
    try {
      const specificationSearched = await this.specificationModel
        .findById(id)
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      ifNotFound({ entity: specificationSearched, id });
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateSpecificationDto: UpdateSpecificationDto) {
    try {
      const specificationUpdated = await this.specificationModel
        .findByIdAndUpdate(id, updateSpecificationDto)
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      ifNotFound({ entity: specificationUpdated, id });
      return specificationUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const specificationDeleted = await this.specificationModel
        .findByIdAndDelete(id)
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      ifNotFound({ entity: specificationDeleted, id });
      removeProductSpecification(id, this.productModel);
      console.log('Se eliminó con éxito');
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: Types.ObjectId) {
    try {
      const specificationDeleted = await this.specificationModel
        .find({ family: id })
        .deleteMany({ family: id })
        .exec();
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: Types.ObjectId) {
    try {
      const specificationDeleted = await this.specificationModel
        .find({ category: id })
        .deleteMany({ category: id })
        .exec();
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeBySubcategoryId(id: Types.ObjectId) {
    try {
      const specificationDeleted = await this.specificationModel
        .find({ subcategory: id })
        .deleteMany({ subcategory: id })
        .exec();
      //ifNotFound({ entity: specificationDeleted, id });
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async findAllByCategoryId(category: Types.ObjectId) {
    try {
      validateId(category);
      const specifications = await this.specificationModel
        .find({ category })
        .exec();
      return specifications;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(family: Types.ObjectId): Promise<number> {
    return this.specificationModel.countDocuments({ family });
  }
  async countByCategoryId(category: Types.ObjectId): Promise<number> {
    return this.specificationModel.countDocuments({ category });
  }
  async countBySubcategoryId(subcategory: Types.ObjectId): Promise<number> {
    return this.specificationModel.countDocuments({ subcategory });
  }
}
