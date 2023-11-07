import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '36b9eeb7c7f984154d000ad2553c598ccbaa7e1acc35c30b9503a4af5ebca4e6',//process.env.JWT_SECRET_KEY, // Replace with your own secret key
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.usersService.getUserByToken(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }
    return user;
  }
}