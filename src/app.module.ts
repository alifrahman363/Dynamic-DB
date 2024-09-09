import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Define the database type
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'alif',
      database: 'main_db', // Your main database where users are registered
      autoLoadEntities: true,
      synchronize: true, // Set to true during development
    }),
    UserModule, // Add the UserModule here
  ],
})
export class AppModule { }
