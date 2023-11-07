import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { User } from '../../models/user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(user: User): Promise<User> {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    const values = [user.email, user.password];

    const result = await this.databaseService.executeQuery(sql, values);

    // Return the created user object
    return {
      ...user,
      id: result.insertId,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];

    const result = await this.databaseService.executeQuery(sql, values);

    if (result.length === 0) {
      return null;
    }

    // Map database result to a User object
    const user: User = {
      id: result[0].id,
      email: result[0].email,
      password: result[0].password,
    };

    return user;
  }

  async getUserById(userId: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const values = [userId];

    const result = await this.databaseService.executeQuery(sql, values);

    if (result.length === 0) {
      return null;
    }

    // Map database result to a User object
    const user: User = {
      id: result[0].id,
      email: result[0].email,
      password: result[0].password,
    };

    return user;
  }
}