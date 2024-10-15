import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Counter extends Document {
  @Prop({ required: true })
  entity: string; // Nombre de la entidad a la que se aplica el contador

  @Prop({ required: true })
  count: number; // Valor actual del contador
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
