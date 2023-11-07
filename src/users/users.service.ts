import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { UserRepository } from '../mysql/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.userRepository.createUser(user);

    return createdUser;
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const payload = { email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async getUserByToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    const userId = decoded.sub;

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
