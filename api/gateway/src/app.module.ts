import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {SiweModule} from "./modules/siwe/siwe.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        SiweModule,
    ]
})
export class AppModule {}
