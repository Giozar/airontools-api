import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from './schemas/family.schema';
import { Model } from 'mongoose';
import { handleDBErrors, ifNotFound, validateId } from 'src/handlers';
import { CategoriesService } from 'src/categories/categories.service';
import { SubcategoriesService } from 'src/subcategories/subcategories.service';
import { SpecificationsService } from 'src/specifications/specifications.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class FamiliesService {
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  constructor(
    @InjectModel(Family.name) private familyModel: Model<Family>,
    private readonly categoriesService: CategoriesService,
    private readonly subcategoriesService: SubcategoriesService,
    private readonly specificationsService: SpecificationsService,
    private readonly productsService: ProductsService,
  ) {}
  async create(createFamilyDto: CreateFamilyDto) {
    try {
      const createdFamily = new this.familyModel(createFamilyDto);
      await createdFamily.save();
      const family = this.familyModel
        .findById(createdFamily._id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      return family;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.familyModel
      .find()
      .populate([this.CREATEDBY, this.UPDATEDBY])
      .exec();
  }

  async findOne(id: string) {
    try {
      const familySearched = await this.familyModel
        .findById(id)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: familySearched, id });
      return familySearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    try {
      const familyUpdated = await this.familyModel
        .findByIdAndUpdate(id, updateFamilyDto)
        .populate([this.CREATEDBY, this.UPDATEDBY])
        .exec();
      ifNotFound({ entity: familyUpdated, id });
      return familyUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const familyDeleted = await this.familyModel
        .findByIdAndDelete(id)
        .populate([this.CREATEDBY, this.UPDATEDBY]);
      ifNotFound({ entity: familyDeleted, id });

      // Se ejecuta eliminación en cadena
      const familyId = validateId(id);
      this.categoriesService.removeByFamilyId(familyId);
      this.subcategoriesService.removeByFamilyId(familyId);
      this.specificationsService.removeByFamilyId(familyId);
      this.productsService.removeByFamilyId(familyId);

      return familyDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
