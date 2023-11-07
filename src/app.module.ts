import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { WebpagesService } from './webpages/webpages.service';
import { WebpagesController } from './webpages/webpages.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { DatabaseService } from './mysql/services/database.service';
import { UserRepository } from './mysql/repositories/user.repository';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WebscrapingService } from './webscraping/webscraping.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Replace with your own secret key
      signOptions: { expiresIn: '24h' }, // Set token expiration
    }),
  ],
  controllers: [AppController, WebpagesController, UsersController],
  providers: [AppService, WebpagesService, UserRepository, UsersService, DatabaseService, JwtStrategy, WebscrapingService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WebpagesController);
  }
}
