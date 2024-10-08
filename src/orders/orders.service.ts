import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import { RepairProduct } from './schemas/repair-product.schema';
import { RepairProductDto } from './dto/repair-product.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @InjectModel(RepairProduct.name)
    private repairProductModel: Model<RepairProduct>,
  ) {}

  // Crear una nueva orden
  async create(createOrderDto: CreateOrderDto) {
    try {
      const orderCreated = new this.orderModel(createOrderDto);
      await orderCreated.save();
      return orderCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Encontrar todas las órdenes
  async findAll() {
    try {
      const ordersFound = await this.orderModel.find();
      return ordersFound;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Encontrar una orden por su ID
  async findOne(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      return order;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Actualizar una orden por su ID
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const orderUpdated = await this.orderModel.findByIdAndUpdate(
        id,
        updateOrderDto,
        { new: true }, // Devolver el documento actualizado
      );
      return orderUpdated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Eliminar una orden por su ID
  async remove(id: string) {
    try {
      const orderRemoved = await this.orderModel.findByIdAndDelete(id);
      return orderRemoved;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async createRepairProduct(createRepairProduct: RepairProductDto) {
    try {
      const repairProductCreated = new this.repairProductModel(
        createRepairProduct,
      );
      await repairProductCreated.save();
      return repairProductCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async updateRepairProduct(id: string, updateRepairProduct: RepairProductDto) {
    try {
      const updatedRepairProduct =
        await this.repairProductModel.findByIdAndUpdate(
          id,
          updateRepairProduct,
        );
      return updatedRepairProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findAllRepairProducts() {
    try {
      const repairProducts = await this.repairProductModel.find().exec();
      return repairProducts;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async findOneRepairProduct(id: string) {
    try {
      const repairProduct = await this.repairProductModel.findById(id).exec();
      return repairProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async removeRepairProduct(id: string) {
    try {
      const removedRepairProduct = await this.repairProductModel
        .findByIdAndDelete(id)
        .exec();
      return removedRepairProduct;
    } catch (error) {
      handleDBErrors(error);
    }
  }
}
