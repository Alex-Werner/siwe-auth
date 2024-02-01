import {Inject, Injectable, OnModuleInit} from "@nestjs/common";

import {SIWE_SERVICE_NAME} from "../../../CONSTANTS";
import {ClientProxy} from "@nestjs/microservices";
import {SiweMessage} from "siwe";
import {VerifySignatureDto} from "./siwe.dto";
import {Observable} from "rxjs";
import {SignUpUserDto} from "../auth/auth.dto";

@Injectable()
export class SiweService implements OnModuleInit {
    private service: any;

    @Inject(SIWE_SERVICE_NAME)
    private readonly client: ClientProxy;

    async onModuleInit(): Promise<void> {
        // await this.client.connect()
    }

    public requestNonce(): Observable<{
        message: SiweMessage,
        nonce: string
    }> {
        const pattern = { cmd: 'SIWE/NONCE/GET', role: 'user'};
        return this.client.send(pattern, {});
    }

    public verifySignature(verifySignatureDto: VerifySignatureDto): Observable<{
        success: boolean,
        message: SiweMessage,
        nonce: string
    }> {
        const pattern = { cmd: 'SIWE/VERIFY', role: 'user'};
        return this.client.send(pattern, verifySignatureDto);

    }

}
