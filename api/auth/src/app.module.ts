import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule} from "@nestjs/typeorm";
import { Module } from '@nestjs/common'
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: Joi.isSchema({
                'application.auth.jwt.secret': Joi.string().default('default-secret'),
                'application.database.path': Joi.string().default('.db'),

                'application.tcp.enable': Joi.boolean().default(true),
                'application.tcp.port': Joi.number().default(8850),

                'application.http.enable': Joi.boolean().default(false),
                'application.http.port': Joi.number().default(8851),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'sqlite',
                database: configService.get('application.database.path'),
                entities: [
                    __dirname + '/**/*.entity{.ts,.js}',
                    __dirname + '/**/*.model{.ts,.js}'
                ],
                synchronize: true,
            }),
        }),
        AuthModule,
    ],
})
export class AppModule {}
