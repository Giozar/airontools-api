import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringService } from './monitoring.service';
import { Monitoring, MonitoringSchema } from './schemas/monitoring.schema';
// import { MonitoringController } from './monitoring.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitoring.name, schema: MonitoringSchema },
    ]),
  ],
  providers: [MonitoringService],
  exports: [MonitoringService], // Exporta el servicio si lo necesitas en otros módulos
  // controllers: [MonitoringController], // Descomentar cuando implementes el controlador
})
export class MonitoringModule {}
