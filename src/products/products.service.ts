import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(product: CreateProductDto) {
    const newPorduct = new this.productModel(product);
    return newPorduct.save();
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    return this.productModel.findOneAndUpdate({ id }, product, { new: true });
  }

  async deleteProduct(id: number) {
    return this.productModel.findOneAndDelete({ id });
  }

  async findOneProductById(id: number) {
    return this.productModel.findOne({ id });
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

  // Método para reiniciar el contador
  async resetCounter(): Promise<void> {
    const model = this.productModel as any;
    if (model.counterReset) {
      await new Promise<void>((resolve, reject) => {
        model.counterReset('id', (err: any) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    } else {
      throw new Error('counterReset method is not available on the model');
    }
  }
}
