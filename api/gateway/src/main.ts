import {NestApplication, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import { Logger, Injectable } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    logger.log('Starting gateway server...');
    const app: NestApplication = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use(cookieParser());
    const configService = app.get(ConfigService);
    const port = configService.get('application.http.port');
    await app.listen(port);
    logger.log(`Gateway Server running on http://localhost:${port}`);
}

bootstrap();
