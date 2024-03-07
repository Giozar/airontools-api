import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type subcategoryDocument = HydratedDocument<Subcategory>
@Schema()
export class Subcategory {
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
    path: string;

    @Prop()
    image: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);