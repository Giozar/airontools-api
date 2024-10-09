import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOtherProductDto } from './dto/create-other-product.dto';
import { UpdateOtherProductDto } from './dto/update-other-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OtherProduct } from './schemas/other-product.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';

@Injectable()
export class OtherProductsService {
  constructor(
    @InjectModel(OtherProduct.name)
    private otherProductModel: Model<OtherProduct>,
  ) {}

  // Crear un nuevo OtherProduct
  async createOtherProduct(createdProductDto: CreateOtherProductDto) {
    try {
      const createdProduct = new this.otherProductModel(createdProductDto);
      await createdProduct.save();
      return createdProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Obtener todos los OtherProducts
  async findAllOtherProducts() {
    try {
      return await this.otherProductModel.find().exec();
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Buscar por marca
  async findAllByBrand(brand: string) {
    return await this.otherProductModel.find({ brand }).exec();
  }

  // Obtener un OtherProduct por ID
  async findOneOtherProduct(id: string) {
    try {
      const product = await this.otherProductModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`OtherProduct con ID ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Actualizar un OtherProduct por ID
  async updateOtherProduct(
    id: string,
    updateOtherProductDto: UpdateOtherProductDto,
  ) {
    try {
      const updatedProduct = await this.otherProductModel
        .findByIdAndUpdate(id, updateOtherProductDto, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new NotFoundException(`OtherProduct con ID ${id} no encontrado`);
      }
      return updatedProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Eliminar un OtherProduct por ID
  async removeOtherProduct(id: string) {
    try {
      const deletedProduct = await this.otherProductModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedProduct) {
        throw new NotFoundException(`OtherProduct con ID ${id} no encontrado`);
      }
      return deletedProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
