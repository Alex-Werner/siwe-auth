import {ClientsModule, Transport} from '@nestjs/microservices';
import {SIWE_SERVICE_NAME} from "../../CONSTANTS";
import {SiweController} from "./siwe.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SiweService} from './siwe.service';
import {Module} from '@nestjs/common';

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
    controllers: [SiweController],
    providers: [SiweService],
    exports: [SiweService],
})
export class SiweModule {
}
