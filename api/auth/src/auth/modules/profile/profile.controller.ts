import {Body, Controller, Get, UseGuards} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import {User} from "../../entities/user.entity";
import {AuthService} from "../../auth.service";

@Controller('profile')
export class ProfileController {
    constructor(private readonly authService: AuthService) {}

    @Get('/me')
    @MessagePattern({role: 'user', cmd: 'PROFILE/GET'})
    async me(@Body() user: User): Promise<User> {
        return await this.authService.findOne(user.id);
    }
}
