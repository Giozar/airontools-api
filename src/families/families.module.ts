import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Family, FamilySchema } from './schemas/family.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

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
    ]),
  ],
})
export class FamiliesModule {}
