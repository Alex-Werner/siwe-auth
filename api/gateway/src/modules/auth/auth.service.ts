import {Inject, Injectable, OnModuleInit} from "@nestjs/common";

import {AUTH_SERVICE_NAME} from "../../../CONSTANTS";
import {ClientProxy} from "@nestjs/microservices";
import {Observable} from "rxjs";
import {Response} from "express";
import {SignInUserDto, SignUpUserDto} from "./auth.dto";

@Injectable()
export class AuthService implements OnModuleInit {
    private service: any;

    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientProxy;

    async onModuleInit(): Promise<void> {
        // await this.client.connect()
    }

    public getProfile(userId: string): Observable<any> {
        const pattern = {cmd: 'PROFILE/GET', role: 'user'};
        const payload = {id: userId};
        return this.client.send(pattern, payload);
    }

    public refresh(refreshToken: string): Observable<any> {
        const pattern = {cmd: 'AUTH/REFRESH_ACCESS_TOKEN', role: 'user'};
        const payload = {refreshToken};
        return this.client.send<{ accessToken: string }>(pattern, payload);
    }
    public signIn(signInUserDto: SignInUserDto, response: Response): Observable<any> {
        const pattern = {cmd: 'AUTH/GENERATE_ACCESS_TOKEN', role: 'user'};
        return this.client.send<{ accessToken: string, refreshToken: string }>(pattern, signInUserDto);
    }

    public signUp(signUpUserDto: SignUpUserDto): Observable<any> {
        const pattern = { cmd: 'USER/CREATE', role: 'user'};
        return this.client.send(pattern, signUpUserDto);
    }
}
