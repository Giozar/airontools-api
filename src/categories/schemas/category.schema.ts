import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type categoryDocument = HydratedDocument<Category>

export class Category {
    @Prop({
        required: true,
        unique: true,
    })
    id: number;

    @Prop({
        required: true,
        unique: true,
    })
    name: string;
    
    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop()
    path: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);