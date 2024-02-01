import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SiweService } from './siwe.service';
import {ConfigModule} from "@nestjs/config";
import {SIWEController} from "./siwe.controller";
import {FIFOSetService} from "./fifoset.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
    ],
    controllers: [SIWEController],
    providers: [SiweService, FIFOSetService],
    exports: [SiweService],
})
export class SiweModule {}
