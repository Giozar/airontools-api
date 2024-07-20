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
import awsConfig from '@config/awsConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, awsConfig], // Para cargar el archivo de configuración
      envFilePath: '.env', // Para leer archivo .env de variables de entorno
      isGlobal: true, // Para que todas la variables de entorno sean globales en la aplicación
    }),
    MongooseModule.forRoot(databaseConfig().database.host),
    CategoriesModule,
    SubcategoriesModule,
    GptModule,
    MailerModule,
    AuthModule,
    FilesModule,
    ProductsModule,
    RolesModule,
    FamiliesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
