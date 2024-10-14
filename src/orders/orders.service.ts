import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
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

  // Método para reiniciar el contador
  async resetCounter(): Promise<void> {
    const model = this.orderModel as any;
    if (model.counterReset) {
      await new Promise<void>((resolve, reject) => {
        model.counterReset('control', (err: any) => {
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
      const order = (await this.orderModel.findById(id)).populate([
        'customer',
        'company',
        'products',
        'receivedBy',
      ]);
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
}
