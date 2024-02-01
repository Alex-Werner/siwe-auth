import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule, JwtModuleOptions} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Users} from '../models/users.model';
import {AuthService} from '../auth.service';
import {Module} from '@nestjs/common';

const signOptions = {
    expiresIn: '60m'
};

@Module({
    imports: [
        PassportModule,
        TypeOrmModule
            .forFeature([
                Users
            ]),
        JwtModule
            .registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
                    secret: configService.get<string>('application.auth.jwt.secret', 'default-secret'),
                    signOptions
                }),
            }),
    ],
    providers: [
        AuthService
    ],
    exports: [
        AuthService,
        PassportModule,
        JwtModule,
        TypeOrmModule
    ]
})
export class AuthSharedModule {
}
