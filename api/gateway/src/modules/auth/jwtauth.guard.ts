import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable, InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTAuthGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const envKey = 'application.auth.jwt.secret';
        const jwtSecret = this.configService.get<string>(envKey);

        if (!jwtSecret) {
            throw new InternalServerErrorException('JWT secret is missing in the configuration');
        }

        const req = context.switchToHttp().getRequest();
        let token: string;

        // check for our access token

        if(req.headers && req.headers['authorization']) {
            const bearerHeader = req.headers['authorization'];
            if (!bearerHeader) {
                throw new UnauthorizedException('Unauthorized request');
            }
            token = bearerHeader.split(' ')[1];
        }

        try {
            req.user = jwt.verify(token, jwtSecret);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
