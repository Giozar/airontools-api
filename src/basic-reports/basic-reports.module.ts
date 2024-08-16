import { Module } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { BasicReportsController } from './basic-reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [BasicReportsController],
  providers: [BasicReportsService],
  imports: [PrinterModule, AuthModule, ProductsModule],
})
export class BasicReportsModule {}
