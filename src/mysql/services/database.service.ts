import { Injectable } from '@nestjs/common';
import { createConnection, Connection, QueryOptions } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: Connection;

  constructor() {
    this.connect();
  }

  async connect() {
    const dbConfig = require('../config/db.config');

    this.connection = await createConnection({
      host: 'localhost',//process.env.DB_HOST,
      port: 3306, //dbConfig.port,
      user: 'root', //dbConfig.user,
      password: '', //dbConfig.password,
      database: 'web-scraping', //dbConfig.database,
    });
    console.log('Connected to database');
  }

  async executeQuery(sql: string, values?: any[]): Promise<any> {
    try {
      const [rows] = await this.connection.query(sql, values);
      return rows;
    } catch (error) {
      throw new Error(`Failed to execute query: ${error.message}`);
    }
  }
}