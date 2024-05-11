import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type toolDocument = HydratedDocument<Tool>;

@Schema()
export class Tool {
  @Prop({
    // Lo comento para modificar las id's de los productos para nerlos en null y orderar los id´s
    unique: true,
    required: true,
  })
  id: number;

  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  categoryId: number;

  @Prop({
    required: true,
  })
  subcategoryId: number;

  @Prop()
  subsubcategoryId: number;

  @Prop()
  path: string;

  @Prop()
  image: string;

  @Prop()
  overview: string;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  specification: string;
}

export const ToolSchema = SchemaFactory.createForClass(Tool);
