import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";

export interface ConfigureOptions {
}

@Injectable()
export class JWTAuthGuard implements CanActivate {

    constructor(
        @Inject(ConfigService) private readonly configService?: ConfigService,
    ) {}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const envKey = 'application.auth.jwt.secret';
        const jwtSecret = this.configService.get<string>(envKey);

        if(!jwtSecret) {
            throw new Error('JWT secret is missing in the configuration');
        }

        const req = context.switchToHttp().getRequest();
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            throw new UnauthorizedException('Unauthorized request');
        }

        const token = bearerHeader.split(' ')[1];
        try {
            req.user = jwt.verify(token, jwtSecret);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
