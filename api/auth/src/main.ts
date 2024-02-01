import {NestApplication, NestFactory} from '@nestjs/core';
import {Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {Logger} from '@nestjs/common';

import {AppModule} from './app.module';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    logger.log('Starting Auth Service...');

    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    try {
        const enableREST = configService.get('application.http.enable');
        if (enableREST) {
            const restPort = configService.get('application.http.port');
            await app.listen(restPort);
            logger.log(`Auth HTTP Service running on localhost:${restPort}`);
        }
        const enableTCP = configService.get('application.tcp.enable');
        if (enableTCP) {
            const servicePort = configService.get('application.tcp.port');
            app.connectMicroservice({
                transport: Transport.TCP,
                options: {
                    port: parseInt(servicePort),
                }
            })
            await app.startAllMicroservices();
            logger.log(`Auth TCP Service running on localhost:${servicePort}`);
        }
    } catch (e){
        logger.error(`Failed to start server: ${e}`);
        process.exit(1);
    }
}

bootstrap();
