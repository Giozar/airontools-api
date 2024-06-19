import databaseConfig from './config/databaseConfig';
import { Module } from '@nestjs/common';
import { ToolsModule } from './tools/tools.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig], // Para cargar el archivo de configuración
      envFilePath: '.env', // Para leer archivo .env de variables de entorno
      isGlobal: true, // Para que todas la variables de entorno sean globales en la aplicación
    }),
    MongooseModule.forRoot(databaseConfig().database.host),
    ToolsModule,
    CategoriesModule,
    SubcategoriesModule,
    GptModule,
    MailerModule,
    AuthModule,
    FilesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
