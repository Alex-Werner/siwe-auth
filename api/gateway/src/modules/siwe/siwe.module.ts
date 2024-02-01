import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SIWEController } from './siwe.controller';
import { SiweService } from './siwe.service';
import {SIWE_SERVICE_NAME} from "../../../CONSTANTS";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
            {
                name: SIWE_SERVICE_NAME,
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get<string>('application.services.siwe.host'),
                        port: configService.get<number>('application.services.siwe.port'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [SIWEController],
    providers: [SiweService],
    exports: [SiweService],
})
export class SiweModule {}
