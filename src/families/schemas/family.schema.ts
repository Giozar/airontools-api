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

  @Prop({ required: true })
  path: string;

  @Prop()
  description: string;

  @Prop()
  images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const FamilySchema = SchemaFactory.createForClass(Family);

// Middleware para eliminar categorías relacionadas
/*FamilySchema.pre('findOne', async function (next) {
  const family = this.getQuery()['_id'];

  try {
    // Aquí buscamos todas las categorías relacionadas con la familia
    const Category = mongoose.model('Category', CategorySchema);

    const x = Category;

    x.find();

    // console.log(x.findOne({ family }));

    //const category = await Category.exists({ family });

    // console.log(category);

    console.log(`Buscamos todas las categorías con la familia ${family}`);
    next();
  } catch (error) {
    console.error(
      `Error al buscar categorías para la familia ${family}:`,
      error,
    );
    next(error);
  }
});
*/
