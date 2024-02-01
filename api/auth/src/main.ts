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
            const hostname = configService.get('application.http.host');

            await app.listen(restPort, hostname);
            logger.log(`Auth HTTP Service running on ${hostname}:${restPort}`);
        }
        const enableTCP = configService.get('application.tcp.enable');
        if (enableTCP) {
            const servicePort = configService.get('application.tcp.port');
            const hostname = configService.get('application.tcp.host');

            app.connectMicroservice({
                transport: Transport.TCP,
                options: {
                    port: parseInt(servicePort),
                    host: hostname,
                }
            })
            await app.startAllMicroservices();
            logger.log(`Auth TCP Service running on ${hostname}:${servicePort}`);
        }
    } catch (e){
        logger.error(`Failed to start server: ${e}`);
        process.exit(1);
    }
}

bootstrap();
