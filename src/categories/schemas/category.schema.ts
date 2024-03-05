import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
