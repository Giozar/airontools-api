import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  async getNextSequence(
    entity: string,
    startAt: number = 1000,
  ): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { entity }, // Busca el documento correspondiente a la entidad
      { $inc: { count: 1 } }, // Incrementa el contador en 1
      {
        new: true, // Devuelve el documento actualizado
        upsert: true, // Si no existe, lo crea
        setDefaultsOnInsert: true, // Establece los valores predeterminados en caso de inserción
      },
    );

    // Si es la primera vez que se crea el contador, inicializa con `startAt`
    if (counter.count === 1) {
      counter.count = startAt;
      await counter.save();
    }

    return counter.count;
  }

  async resetSequence(entity: string, startAt: number = 1000): Promise<void> {
    await this.counterModel.findOneAndUpdate(
      { entity }, // Busca el documento del contador por la entidad
      { count: startAt }, // Establece el valor del contador al valor deseado
      { new: true, upsert: true }, // Si no existe, lo crea con el valor `startAt`
    );
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Obtener el siguiente número autoincrementable
      const control = await this.getNextSequence('order', 4000);

      // Crear el nuevo objeto de la orden
      const orderCreated = new this.orderModel({
        ...createOrderDto, // Copiar los datos de createOrderDto
        control, // Asignar el valor autoincrementado al campo `id`
      });

      // Guardar la nueva orden en la base de datos
      await orderCreated.save();

      // Devolver la orden creada
      return orderCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Método para reiniciar el contador
  async resetOrderCounter() {
    await this.resetSequence('order', 4000); // Reinicia el contador a 1000
    console.log('El contador de órdenes ha sido reiniciado.');
  }

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
