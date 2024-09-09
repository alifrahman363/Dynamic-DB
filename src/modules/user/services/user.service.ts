import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from '../dtos/register-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly connection: Connection,
    ) { }

    async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
        try {
            const { username, password } = registerUserDto;
            const newUser = this.userRepository.create({ username, password });
            const savedUser = await this.userRepository.save(newUser);

            const dbName = `user_db_${savedUser.id}`;
            savedUser.db_name = dbName;
            await this.userRepository.save(savedUser);

            await this.createUserDatabase(dbName);

            return { statusCode: 201, message: 'User registered successfully', data: savedUser };
        } catch (error) {
            return { statusCode: 500, message: 'User registration failed', error: error.message };
        }
    }

    private async createUserDatabase(dbName: string): Promise<void> {
        await this.connection.query(`CREATE DATABASE ${dbName}`);
        await this.connection.query(`
            CREATE TABLE ${dbName}.example_table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                data VARCHAR(255)
            )
        `);
    }

    async getUserData(userId: number): Promise<any> {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });

            if (!user) {
                return { statusCode: 404, message: 'User not found' };
            }

            const dbName = user.db_name;
            const data = await this.connection.query(`SELECT * FROM ${dbName}.example_table`);

            return { statusCode: 200, message: 'Data fetched successfully', data };
        } catch (error) {
            return { statusCode: 500, message: 'Failed to fetch data', error: error.message };
        }
    }
}
