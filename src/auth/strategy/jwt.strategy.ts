import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            expiresIn: '7d',
            secretOrKey: config.get<string>('SECRET_KEY'),
        });
    }
    async validate(payload: any) {
        const user = await this.authService.checkUser(payload.id);
        console.log(user);
        console.log(payload);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
