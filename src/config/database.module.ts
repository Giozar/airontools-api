import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './databaseConfig';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig().database.host, {
      connectionFactory: (connection) => {
        connection.name = 'airontools'; // Set custom connection name here
        return connection;
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
