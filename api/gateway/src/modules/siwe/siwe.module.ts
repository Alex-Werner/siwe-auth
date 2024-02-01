import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SIWEController } from './siwe.controller';
import { SiweService } from './siwe.service';
import {SIWE_SERVICE_NAME} from "../../../CONSTANTS";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ClientsModule.register([
            {
                name: SIWE_SERVICE_NAME,
                transport: Transport.TCP,
                options: { port: 8860 },
            },
        ]),
    ],
    controllers: [SIWEController],
    providers: [SiweService],
    exports: [SiweService],
})
export class SiweModule {}
