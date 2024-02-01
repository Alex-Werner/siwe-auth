import {AuthSharedModule} from "../auth.shared.module";
import {SiweModule} from "../../../siwe/siwe.module";
import {SignInController} from "./signin.controller";
import {AuthService} from "../../auth.service";
import {Module} from '@nestjs/common';

@Module({
    controllers: [SignInController],
    imports: [AuthSharedModule, SiweModule],
    providers: [AuthService],
})
export class SignInModule {
}
