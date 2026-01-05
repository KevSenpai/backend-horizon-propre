import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // En prod, mettez une phrase secrète complexe dans le .env !
      secretOrKey: configService.get<string>('JWT_SECRET') || 'SECRET_TEMPORAIRE_POUR_DEV', 
    });
  }

  async validate(payload: any) {
    // Ce que la requête reçoit dans req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}