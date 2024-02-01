import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './modules/auth/auth.module'
import {SiweModule} from "./modules/siwe/siwe.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        SiweModule,
    ]
})
export class AppModule {}
