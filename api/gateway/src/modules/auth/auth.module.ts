import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {AUTH_SERVICE_NAME} from "../../../CONSTANTS";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal:true
        }),
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE_NAME,
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get<string>('application.services.auth.host'),
                        port: configService.get<number>('application.services.auth.port'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
