import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const FamilySchema = SchemaFactory.createForClass(Family);

// Middleware para eliminar categorías relacionadas
/*FamilySchema.pre('findOne', async function (next) {
  const familyId = this.getQuery()['_id'];

  try {
    // Aquí buscamos todas las categorías relacionadas con la familia
    const Category = mongoose.model('Category', CategorySchema);

    const x = Category;

    x.find();

    // console.log(x.findOne({ familyId }));

    //const category = await Category.exists({ familyId });

    // console.log(category);

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
*/
