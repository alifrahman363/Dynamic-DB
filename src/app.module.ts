import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'alif',
      database: 'main_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ProductModule
  ],
})
export class AppModule { }
