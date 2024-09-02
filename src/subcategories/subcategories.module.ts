import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';

import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Family, FamilySchema } from 'src/families/schemas/family.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import {
  Specification,
  SpecificationSchema,
} from 'src/specifications/schemas/specification.schema';
import { SpecificationsModule } from 'src/specifications/specifications.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [SubcategoriesService],
  controllers: [SubcategoriesController],
  exports: [SubcategoriesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Subcategory.name,
        schema: SubcategorySchema,
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
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Specification.name,
        schema: SpecificationSchema,
      },
    ]),
    SpecificationsModule,
    ProductsModule,
  ],
})
export class SubcategoriesModule {}
