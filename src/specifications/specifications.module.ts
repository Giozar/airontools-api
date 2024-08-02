import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Specification,
  SpecificationSchema,
} from './schemas/specification.schema';
import { Family, FamilySchema } from 'src/families/schemas/family.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import {
  Subcategory,
  SubcategorySchema,
} from 'src/subcategories/schemas/subcategory.schema';

@Module({
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Specification.name,
        schema: SpecificationSchema,
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
        name: Subcategory.name,
        schema: SubcategorySchema,
      },
    ]),
  ],
})
export class SpecificationsModule {}
