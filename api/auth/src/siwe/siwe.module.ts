import { ClientsModule, Transport } from '@nestjs/microservices';
import {SIWE_SERVICE_NAME} from "../../CONSTANTS";
import {SiweController} from "./siwe.controller";
import {ConfigModule} from "@nestjs/config";
import { SiweService } from './siwe.service';
import { Module } from '@nestjs/common';

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
    controllers: [SiweController],
    providers: [SiweService],
    exports: [SiweService],
})
export class SiweModule {}
