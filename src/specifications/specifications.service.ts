import { Injectable } from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Specification } from './schemas/specification.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import { removeProductSpecification } from './handlers/removeProductSpecification';
import { Product } from 'src/products/schemas/product.schema';

@Injectable()
export class SpecificationsService {
  private FAMILIES = 'families';
  private CATEGORIES = 'categories';
  private SUBCATEGORIES = 'subcategories';
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
          this.FAMILIES,
          this.CATEGORIES,
          this.SUBCATEGORIES,
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
        this.FAMILIES,
        this.CATEGORIES,
        this.SUBCATEGORIES,
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
          this.FAMILIES,
          this.CATEGORIES,
          this.SUBCATEGORIES,
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
          this.FAMILIES,
          this.CATEGORIES,
          this.SUBCATEGORIES,
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
          this.FAMILIES,
          this.CATEGORIES,
          this.SUBCATEGORIES,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      ifNotFound({ entity: specificationDeleted, id });
      removeProductSpecification(id, this.productModel);
      console.log('Se eliminó con éxito la especificación');
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByFamilyId(id: string) {
    try {
      //Obtiene todas las especificaciones que tenga el familyId
      const specifications = await this.specificationModel.find({
        families: id,
      });

      for (const specification of specifications) {
        // Eliminar el ID de familia del arreglo
        specification.families = specification.families.filter(
          (familyId) => familyId.toString() !== id.toString(),
        );

        // Verificar si el arreglo de familias quedó vacío y eliminar la especificación si es necesario
        if (
          specification.families.length === 0 &&
          specification.categories.length === 0 &&
          specification.subcategories.length === 0
        ) {
          await this.remove(specification._id.toString());
          // Llama a removeProductSpecification cuando se elimina una especificación completa
          removeProductSpecification(specification._id, this.productModel);
        } else {
          await specification.save();
        }
      }

      return { deleted: specifications.length };
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: string) {
    try {
      const specificationDeleted = await this.specificationModel
        .find({ categories: id })
        .deleteMany({ categories: id })
        .exec();
      // ifNotFound({
      //   entity: specificationDeleted,
      //   id: specificationDeleted._id,
      // });
      removeProductSpecification(specificationDeleted._id, this.productModel);
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeBySubcategoryId(id: string) {
    try {
      const specificationDeleted = await this.specificationModel
        .find({ subcategories: id })
        .deleteMany({ subcategories: id })
        .exec();
      // ifNotFound({
      //   entity: specificationDeleted,
      //   id: specificationDeleted._id,
      // });
      removeProductSpecification(specificationDeleted._id, this.productModel);
      return specificationDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async findAllByCategoryId(categories: string) {
    try {
      validateId(categories);
      const specifications = await this.specificationModel
        .find({ categories })
        .exec();
      return specifications;
    } catch (error) {
      handleDBErrors(error);
    }
  }
  async countByFamilyId(families: string): Promise<number> {
    return this.specificationModel.countDocuments({ families });
  }
  async countByCategoryId(categories: string): Promise<number> {
    return this.specificationModel.countDocuments({ categories });
  }
  async countBySubcategoryId(subcategories: string): Promise<number> {
    return this.specificationModel.countDocuments({ subcategories });
  }
}
