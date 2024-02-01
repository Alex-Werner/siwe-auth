import {NestApplication, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import { Logger, Injectable } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    logger.log('Starting gateway server...');
    const app: NestApplication = await NestFactory.create(AppModule);
    app.use(cookieParser());
    const configService = app.get(ConfigService);
    const port = configService.get('application.http.port');

    const hostname = configService.get('application.http.host');
    const enableCorsOrigins = configService.get('application.http.cors.origin');
    console.log(enableCorsOrigins);
    app.enableCors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });

    console.log(configService.get<string>('application.services.siwe.host'));
    console.log(configService.get<string>('application.services.siwe.port'));
    await app.listen(port, hostname);
    logger.log(`Gateway Server running on http://${hostname}:${port}`);
}

bootstrap();
