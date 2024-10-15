import { Injectable } from '@nestjs/common';
import { Counter } from './schemas/counter.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class CountersService {
  constructor(
    @InjectModel(Counter.name)
    private counterModel: Model<Counter>,
  ) {}
  async getNextSequence(entity: string, startAt: number = 1): Promise<number> {
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

  async resetSequence(entity: string, startAt: number = 1): Promise<void> {
    await this.counterModel.findOneAndUpdate(
      { entity }, // Busca el documento del contador por la entidad
      { count: startAt }, // Establece el valor del contador al valor requerido
      { new: true, upsert: true }, // Si no existe, lo crea con el valor `startAt`
    );
  }
}
