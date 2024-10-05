import databaseConfig from './config/databaseConfig';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';
import { FamiliesModule } from './families/families.module';
import { SpecificationsModule } from './specifications/specifications.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SeedModule } from './seed/seed.module';
import { BasicReportsModule } from './basic-reports/basic-reports.module';
import { PrinterModule } from './printer/printer.module';
import awsConfig from '@config/awsConfig';
import clientConfig from '@config/clientConfig';
import mailerConfig from '@config/mailerConfig';
import gptConfig from '@config/gptConfig';
import { JoiValidationSchema } from '@config/joi.validation';
import serverConfig from '@config/serverConfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        serverConfig,
        databaseConfig,
        awsConfig,
        clientConfig,
        mailerConfig,
        gptConfig,
      ], // Para cargar el archivo de configuración
      envFilePath: '.env', // Para leer archivo .env de variables de entorno
      validationSchema: JoiValidationSchema,
      isGlobal: true, // Para que todas la variables de entorno sean globales en la aplicación
    }),
    MongooseModule.forRoot(databaseConfig().database.host),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'assets'),
      serveRoot: '/',
    }),
    CategoriesModule,
    SubcategoriesModule,
    GptModule,
    MailerModule,
    AuthModule,
    FilesModule,
    ProductsModule,
    RolesModule,
    FamiliesModule,
    SpecificationsModule,
    MonitoringModule,
    SeedModule,
    BasicReportsModule,
    PrinterModule,
    CustomersModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
