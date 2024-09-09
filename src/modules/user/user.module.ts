import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this to connect the User entity with TypeORM
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity'; // Import the User entity

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Connect User entity to TypeORM
  ],
  providers: [UserService], // Register the UserService
  controllers: [UserController], // Register the UserController
})
export class UserModule { }
