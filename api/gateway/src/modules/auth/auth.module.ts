import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {AUTH_SERVICE_NAME} from "../../../CONSTANTS";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ClientsModule.register([
            {
                name: AUTH_SERVICE_NAME,
                transport: Transport.TCP,
                options: { port: 8850 },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
