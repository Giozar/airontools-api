import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from './schemas/family.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import {
  Subcategory,
  SubcategorySchema,
} from 'src/subcategories/schemas/subcategory.schema';
import {
  Specification,
  SpecificationSchema,
} from 'src/specifications/schemas/specification.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import { SubcategoriesModule } from 'src/subcategories/subcategories.module';
import { SpecificationsModule } from 'src/specifications/specifications.module';
import { ProductsModule } from 'src/products/products.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [FamiliesController],
  providers: [FamiliesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Family.name,
        schema: FamilySchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
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
    CategoriesModule,
    SubcategoriesModule,
    SpecificationsModule,
    ProductsModule,
    FilesModule,
  ],
  exports: [FamiliesService],
})
export class FamiliesModule {}
