import { Module } from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import * as Joi from 'joi';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SiweModule} from "./siwe/siwe.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: Joi.isSchema({
                'application.auth.jwt.secret': Joi.string().default('default-secret'),
                'application.database.name': Joi.string().default('default-database'),

                'application.tcp.enable': Joi.boolean().default(true),
                'application.tcp.port': Joi.number().default(8860),

                'application.http.enable': Joi.boolean().default(false),
                'application.http.port': Joi.number().default(8861),
            }),
        }),
        SiweModule,
    ],
})
export class AppModule {}
