import {ProfileModule} from "./modules/profile/profile.module";
import {SignInModule} from "./modules/signin/signin.module";
import {SignUpModule} from "./modules/signup/signup.module";
import {Module} from '@nestjs/common';

@Module({
    imports: [
        ProfileModule,
        SignInModule,
        SignUpModule
    ],
})
export class AuthModule {
}
