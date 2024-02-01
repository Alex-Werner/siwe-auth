import {Module} from '@nestjs/common';

import {ProfileController} from "./profile.controller";
import {AuthSharedModule} from "../auth.shared.module";
import {AuthService} from "../../auth.service";

@Module({
    imports: [AuthSharedModule],
    controllers: [ProfileController],
    providers: [AuthService],
})
export class ProfileModule {}
