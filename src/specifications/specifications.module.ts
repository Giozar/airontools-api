import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';

@Module({
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
})
export class SpecificationsModule {}
