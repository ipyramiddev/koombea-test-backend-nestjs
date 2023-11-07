import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    // Get the token from the request headers, query params, or cookies
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
      } catch (error) {
        // Handle token verification error
        // You can choose to respond with an error or proceed without the user object
      }
    }

    next();
  }
}