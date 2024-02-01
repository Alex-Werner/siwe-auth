import {AuthSharedModule} from "../auth.shared.module";
import {SignUpController} from "./signup.controller";
import {AuthService} from "../../auth.service";
import {Module} from '@nestjs/common';

@Module({
    controllers: [SignUpController],
    imports: [AuthSharedModule],
    providers: [AuthService],
})
export class SignUpModule {
}
