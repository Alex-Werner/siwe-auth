import {Body, Controller, Post} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import {AuthService} from "../../auth.service";

@Controller('user')
export class SignUpController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signin')
    @MessagePattern({role: 'user', cmd: 'USER/CREATE'})
    async signUp(@Body() signUp: any): Promise<any> {
        return this
            .authService
            .signup(signUp)
    }
}
