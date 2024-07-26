import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Specification,
  SpecificationSchema,
} from './schemas/specification.schema';

@Module({
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Specification.name,
        schema: SpecificationSchema,
      },
    ]),
  ],
})
export class SpecificationsModule {}
