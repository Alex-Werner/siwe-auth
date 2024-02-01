import {NestApplication, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import { Logger, Injectable } from '@nestjs/common';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
    const logger = new Logger('bootstrap');
    logger.log('Starting Siwe Service...');

    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    /* HTTP */
    const enableREST = configService.get('application.http.enable');
    if(enableREST) {
        const restPort = configService.get('application.http.port');
        try {
            await app.listen(restPort)
            logger.log(`Siwe HTTP Service running on localhost:${restPort}`);
        } catch (e) {
            logger.error(`Failed to start server: ${e}`);
            process.exit(1);
        }
    }

    /* TCP */
    const enableTCP = configService.get('application.tpc.enable');
    if(enableTCP) {
        const servicePort = configService.get('application.tpc.port');
        try {
            app.connectMicroservice({
                transport: Transport.TCP,
                options: {
                    port: parseInt(servicePort),
                }
            })

            await app.startAllMicroservices();
            logger.log(`Siwe TCP Service running on localhost:${servicePort}`);
        } catch (e) {
            logger.error(`Failed to start server: ${e}`);
            process.exit(1);
        }
    }
}

bootstrap();
