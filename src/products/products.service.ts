import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Family } from 'src/families/schemas/family.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Subcategory } from 'src/subcategories/schemas/subcategory.schema';
import { User } from 'src/auth/schemas/user.schema';
import { Specification } from 'src/specifications/schemas/specification.schema';
import { handleDBErrors, validateId } from 'src/handlers';

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

  async assignDatasheet(id: string, dataSheet: string) {
    return this.productModel.findByIdAndUpdate(
      id,
      { technicalDatasheet: dataSheet },
      { new: true },
    );
  }

  // Modificar la firma del método findOne para que refleje el tipo de retorno esperado
  async findOne(id: string): Promise<
    Product & {
      _id: Types.ObjectId;
      family: Family;
      category: Category;
      subcategory: Subcategory;
      specifications: {
        specification: Specification;
        value: string;
      }[];
      createdBy: User;
      updatedBy: User;
    }
  > {
    validateId(id);
    const product = await this.productModel
      .findById(id)
      .populate([
        { path: this.FAMILY, model: 'Family' },
        { path: this.CATEGORY, model: 'Category' },
        { path: this.SUBCATEGORY, model: 'Subcategory' },
        { path: this.CREATEDBY, model: 'User' },
        { path: this.UPDATEDBY, model: 'User' },
        { path: this.SPECIFICATIONS, model: 'Specification' },
      ])
      .lean()
      .exec();

    // Verificamos que el producto existe y retornamos el producto
    if (!product) {
      throw new Error('Product not found');
    }

    // Convertir el producto a un tipo específico si es necesario
    return product as Product & {
      _id: Types.ObjectId;
      family: Family;
      category: Category;
      subcategory: Subcategory;
      specifications: {
        specification: Specification;
        value: string;
      }[];
      createdBy: User;
      updatedBy: User;
    };
  }

  async findAllByFamilyId(id: string) {
    try {
      const productSearched = await this.productModel
        .find({ FAMILY: id })
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      return productSearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllByCategoryId(id: string) {
    try {
      const productSearched = await this.productModel
        .find({ CATEGORY: id })
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      return productSearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllBySubcategoryId(id: string) {
    try {
      const productSearched = await this.productModel
        .find({ subCATEGORY: id })
        .populate([
          this.FAMILY,
          this.CATEGORY,
          this.SUBCATEGORY,
          this.CREATEDBY,
          this.UPDATEDBY,
        ])
        .exec();
      return productSearched;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllBySpecificationId(id: string) {
    try {
      return this.productModel.find({
        specifications: { $elemMatch: { id } },
      });
    } catch (error) {
      handleDBErrors(error);
    }
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

  async removeByFamilyId(id: string) {
    try {
      const productDeleted = await this.productModel
        .find({ family: id })
        .deleteMany({ family: id })
        .exec();
      return productDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeByCategoryId(id: string) {
    try {
      const productDeleted = await this.productModel
        .find({ category: id })
        .deleteMany({ category: id })
        .exec();
      return productDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeBySubcategoryId(id: string) {
    try {
      const productDeleted = await this.productModel
        .find({ subcategory: id })
        .deleteMany({ subcategory: id })
        .exec();
      //ifNotFound({ entity: productDeleted, id });
      return productDeleted;
    } catch (error) {
      handleDBErrors(error);
    }
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
  async countBySpecificationId(specification: string): Promise<number> {
    return this.productModel.countDocuments({
      specifications: { $elemMatch: { specification } },
    });
  }
}
