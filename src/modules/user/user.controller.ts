import { Controller, Post, Body, Get, Param, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './register-user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto, @Res() response: Response) {
        try {
            const result = await this.userService.registerUser(registerUserDto);
            return response.status(result.statusCode).json(result);
        } catch (error) {
            return response.status(500).json({ statusCode: 500, message: 'Internal server error', error: error.message });
        }
    }

    @Get('data/:userId')
    async getData(@Param('userId') userId: number, @Res() response: Response) {
        try {
            const result = await this.userService.getUserData(userId);
            return response.status(result.statusCode).json(result);
        } catch (error) {
            return response.status(500).json({ statusCode: 500, message: 'Internal server error', error: error.message });
        }
    }
}
