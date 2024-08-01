import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type familyDocument = HydratedDocument<Family>;

@Schema({
  timestamps: true,
})
export class Family {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  path: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const FamilySchema = SchemaFactory.createForClass(Family);

// Middleware para eliminar categorías relacionadas
FamilySchema.pre('findOne', async function (next) {
  const familyId = this.getQuery()['_id'];

  try {
    // Aquí buscamos todas las categorías relacionadas con la familia
    // const categories = await CategoryModel.findCategoriesByFamilyId(familyId);

    console.log(`Buscamos todas las categorías con la familia ${familyId}`);
    next();
  } catch (error) {
    console.error(
      `Error al buscar categorías para la familia ${familyId}:`,
      error,
    );
    next(error);
  }
});
