import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from './schemas/family.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';

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
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
})
export class FamiliesModule {}
