import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {
  @Prop({ required: true })
  entity: string;

  @Prop({ required: true, default: 0 })
  count: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
