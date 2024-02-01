import {
    ExecutionContext, Get, HttpException, HttpStatus,
    Body, Controller, createParamDecorator,
    Logger, Post, Req, Res, UseGuards
} from "@nestjs/common";
import {catchError, firstValueFrom, throwError, Observable, lastValueFrom, map, from} from "rxjs";
import {ConfigService} from "@nestjs/config";
import {Response,Request} from "express";

import {AuthService} from "./auth.service";
import {JWTAuthGuard} from "./jwtauth.guard";
import {ProfileDto, SignInUserDto, SignUpUserDto} from "./auth.dto";
export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
});

function sendError(e: any) {
    switch (e?.status) {
        case 400:
            return throwError(() => new HttpException(e.message, HttpStatus.BAD_REQUEST));
        default:
            return throwError(() => new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}

@Controller('/user')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService) {
    }

    @UseGuards(JWTAuthGuard)
    @Get('/profile')
    getProfile(
        @Body() body: ProfileDto,
        @Req() req: Request
    ): Observable<any> {
        const userId = req.user['sub'];
        if(!userId) {
            return throwError(() => new HttpException('User not found', HttpStatus.NOT_FOUND));
        }
        this.logger.debug(`GET /user/profile - Profile request from ${userId}`);
        return this.authService
            .getProfile(userId)
            .pipe(catchError(sendError));
    }

    @Get('/refresh')
    refresh(
        @Req() req: Request,
        @Cookies('refresh_token') cookies: any
    ): Observable<any> {
        const refreshToken = req.cookies['refresh_token'];
        this.logger.debug(`GET /user/refresh - Refresh request from ${refreshToken}`);

        if (!refreshToken || refreshToken === '') {
            return throwError(() => new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST));
        }

        const serviceResponse = this.authService.refresh(refreshToken).pipe(
            catchError(error => throwError(() => error)),
        );

        return from(lastValueFrom(serviceResponse)).pipe(
            map(result => ({ success: true, accessToken: result.accessToken })),
            catchError(error => throwError(() => error))
        );
    }
    @Post('/signin')
    async signin(
        @Body() signInUserDto: SignInUserDto,
        @Res() response: Response,
        @Cookies('refresh_token') cookies: string
    ): Promise<Observable<any>> {
        return new Observable<any>((observer) => {
            this.logger.debug(`POST /user/signin - Sign-in request from ${signInUserDto.username}`);

            const handleSignIn = async () => {
                try {
                    const serviceResponse = await firstValueFrom(this.authService.signIn(signInUserDto, response).pipe(catchError(sendError)));
                    if (!serviceResponse.success) {
                        throw new HttpException(serviceResponse.error, HttpStatus.BAD_REQUEST);
                    }

                    response.cookie('refresh_token', serviceResponse.refreshToken, {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax'
                    });

                    response.send({ success: true, accessToken: serviceResponse.accessToken });
                    observer.next({ success: true });
                    observer.complete();
                } catch (error) {
                    observer.error(error);
                }
            };

            handleSignIn();
        });
    }


    @Post('/signup')
    signup(
        @Body() signUpUserDto: SignUpUserDto,
    ): Observable<any> {
        this.logger.debug(`POST /user/signup - Sign-up request from ${signUpUserDto.username}`);
        return this.authService
            .signUp(signUpUserDto)
            .pipe(catchError(sendError));
    }
}
