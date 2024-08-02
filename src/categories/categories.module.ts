import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Family, FamilySchema } from 'src/families/schemas/family.schema';
import {
  Subcategory,
  SubcategorySchema,
} from 'src/subcategories/schemas/subcategory.schema';
import {
  Specification,
  SpecificationSchema,
} from 'src/specifications/schemas/specification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Family.name,
        schema: FamilySchema,
      },
      {
        name: Subcategory.name,
        schema: SubcategorySchema,
      },
      {
        name: Specification.name,
        schema: SpecificationSchema,
      },
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
