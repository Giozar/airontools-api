import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  private FAMILY = 'family';
  private CATEGORY = 'category';
  private SUBCATEGORY = 'subcategory';
  private CREATEDBY = 'createdBy';
  private UPDATEDBY = 'updatedBy';
  private SPECIFICATIONS = 'specifications.specification';
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createdProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createdProductDto);
    await createdProduct.save();
    const product = this.productModel
      .findById(createdProduct._id)
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
        this.SPECIFICATIONS,
      ])
      .exec();

    return product;
  }

  async update(id: string, product: UpdateProductDto) {
    return this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
        this.SPECIFICATIONS,
      ])
      .exec();
  }

  async remove(id: string) {
    return this.productModel
      .findByIdAndDelete(id)
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
        this.SPECIFICATIONS,
      ])
      .exec();
  }

  async findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
        this.SPECIFICATIONS,
      ])
      .exec();
  }

  async findAll() {
    return await this.productModel
      .find()
      .populate([
        this.FAMILY,
        this.CATEGORY,
        this.SUBCATEGORY,
        this.CREATEDBY,
        this.UPDATEDBY,
        this.SPECIFICATIONS,
      ])
      .exec();
  }

  async searchProduct(
    keywords: string = '',
    limit: number = 10,
    offset: number = 0,
  ): Promise<any> {
    // Descomentar si se quiere devolver un objeto con la palabra clave y los productos encontrados
    // interface ProductSearchResult {
    //   keyword: string;
    //   product: Product[];
    // }

    const productSearchResults: Product[] = [];

    const keywordArray = keywords.split(' ');

    for (const keyword of keywordArray) {
      const products = await this.productModel
        .find({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { path: { $regex: keyword, $options: 'i' } },
            { overview: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { specification: { $regex: keyword, $options: 'i' } },
          ],
        })
        .limit(limit)
        .skip(offset)
        .sort({
          id: 1,
          // name: 1, // Ordena la propiedad ascendentemente
        });
      // .select('-created_at'); // Indica que en la respuesta no vendrá esta propiedad

      // Solo agregamos al resultado si se encontraron productos para la palabra clave actual
      if (products.length > 0) {
        // Descomentar si se quiere devolver un objeto con la palabra clave y las productos encontradas
        // productSearchResults.push({ keyword, tools });

        productSearchResults.push(...products);
      }
    }

    return productSearchResults;
  }
  async countByFamilyId(family: string): Promise<number> {
    return this.productModel.countDocuments({ family });
  }
  async countByCategoryId(category: string): Promise<number> {
    return this.productModel.countDocuments({ category });
  }
  async countBySubcategoryId(subcategory: string): Promise<number> {
    return this.productModel.countDocuments({ subcategory });
  }
}
