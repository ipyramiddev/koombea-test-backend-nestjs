import { Controller, Body, Post, Get, Headers, UnauthorizedException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() userData: User): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }): Promise<{ token: string }> {
    const token = await this.usersService.loginUser(loginData.email, loginData.password);
    if (token) {
      return { token };
    }
    throw new UnauthorizedException('Invalid login credentials.');
  }

  @Get('profile')
  async getUserProfile(@Headers('authorization') authHeader: string): Promise<User> {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided or invalid token format.');
    }
    const user = await this.usersService.getUserByToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return user;
  }
}
