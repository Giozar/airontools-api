import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from './schemas/subcategory.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubcategoriesService {
    constructor(@InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>){}

    getAllSubcategories(): Promise<Subcategory[]> {
        return this.subcategoryModel.find();
    }

    getSubcategoriesForId(categoryId: number): Promise<Subcategory[]> {
        return this.subcategoryModel.find({ categoryId })
    }
}