import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { handleDBErrors } from 'src/handlers';
import { CountersService } from 'src/counters/counters.service';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private readonly countersService: CountersService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Obtener el siguiente número autoincrementable
      const control = await this.countersService.getNextSequence('order', 4000);

      // Crear el nuevo objeto de la orden
      const orderCreated = new this.orderModel({
        ...createOrderDto, // Copiar los datos de createOrderDto
        control, // Asignar el valor autoincrementado al campo `control`
      });

      // Guardar la nueva orden en la base de datos
      await orderCreated.save();

      // Devolver la orden creada
      return orderCreated;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async createRepairOrder(
    id: string,
    createRepairOrderDto: CreateRepairOrderDto,
  ) {
    try {
      const repairOrder = await this.orderModel.findByIdAndUpdate(
        id,
        createRepairOrderDto,
        { new: true }, // Devolver el documento actualizado
      );
      return repairOrder;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  // Método para reiniciar el contador
  async resetOrderCounter() {
    await this.countersService.resetSequence('order', 4000); // Reinicia el contador a 1000
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
      const ordersFound = await this.orderModel
        .find()
        .populate(['customer', 'company', 'products', 'receivedBy']);
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

  //nota: $unwind quita datos no relacionados o rotos
  async searchOrder(
    keywords: string = '',
    limit: number = 10,
    page: number = 1,
  ): Promise<any> {
    let matchConditions = {};
    const keywordArray = keywords.split(' ').filter((k) => k.trim()); // Filtrar palabras vacías

    if (keywordArray.length > 0) {
      // Generar condiciones de búsqueda basadas en los keywords
      const keywordConditions = keywordArray.map((keyword) => {
        const isNumeric = /^\d+$/.test(keyword); // Verificar si el keyword es solo números

        return isNumeric
          ? {
              $expr: {
                $regexMatch: {
                  input: { $toString: '$control' },
                  regex: keyword,
                  options: 'i',
                },
              },
            }
          : { 'customerDetails.name': { $regex: keyword, $options: 'i' } };
      });

      matchConditions = { $or: keywordConditions }; // Usar $or para combinar condiciones
    }

    // Crear agregación con paginación y conteo total
    const ordersQuery = this.orderModel.aggregate([
      {
        $addFields: {
          customerObjectId: { $toObjectId: '$customer' }, // Convertir 'customer' a ObjectId
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerObjectId',
          foreignField: '_id',
          as: 'customerDetails', // Unir con la colección customers
        },
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true, // Asegura que los documentos sin coincidencia aún se incluyan
        },
      },
      {
        $lookup: {
          from: 'companies', // Hacemos el populate para 'company'
          localField: 'company',
          foreignField: '_id',
          as: 'companyDetails',
        },
      },
      {
        $unwind: {
          path: '$companyDetails',
          preserveNullAndEmptyArrays: true, // Evitar perder resultados si no tienen 'company'
        },
      },
      {
        $lookup: {
          from: 'products', // Hacemos el populate para 'products'
          localField: 'products',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $lookup: {
          from: 'users', // Hacemos el populate para 'receivedBy'
          localField: 'receivedBy',
          foreignField: '_id',
          as: 'receivedByDetails',
        },
      },
      {
        $match: matchConditions, // Aplicar las condiciones de búsqueda
      },
      { $sort: { createdAt: -1 } }, // Ordenar por fecha de creación

      // Conteo total antes de la paginación
      {
        $facet: {
          total: [{ $count: 'count' }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const result = await ordersQuery.exec();

    const ordersFound = result[0].data;
    const total = result[0].total.length > 0 ? result[0].total[0].count : 0;
    const populatedOrders = await this.orderModel.populate(
      ordersFound,
      'customer company products receivedBy',
    );
    return {
      data: populatedOrders,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }

  //Las siguientes podrian ser candidatas a find all
  /*
  //Esta alternativa tiene mejor rendimiento
  async paginate(limit: number = 10, lastId?: string) {
    const query = lastId ? { _id: { $gt: lastId } } : {};
    const data = await this.orderModel.find(query).limit(limit).exec();

    return {
      data,
      lastId: data.length ? data[data.length - 1]._id : null,
      limit,
    };
  }*/
  /* //Esta alternativa es lo que esperarias que hiciera paginate
  async paginate(page: number = 1, limit: number = 10) {
    const data = await this.orderModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments().exec();
    return {
      data,
      total,
      page,
      limit,
    };
  }
  */

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
