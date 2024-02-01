import { BadRequestException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, Observable, throwError } from "rxjs";
import { SIWE_SERVICE_NAME } from "../../CONSTANTS";
import { VerifySignatureDto } from "./siwe.dto";

function sendRPCError(e: any) {
    return throwError(() => new RpcException(new BadRequestException(e.message)));
}

@Injectable()
export class SiweService implements OnModuleInit {
    @Inject(SIWE_SERVICE_NAME)
    private readonly client: ClientProxy;

    async onModuleInit(): Promise<void> {
        // await this.client.connect()
    }

    public verifySignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
        const pattern = { cmd: 'SIWE/VERIFY', role: 'user' };
        return this.client.send(pattern, verifySignatureDto).pipe(catchError(sendRPCError));
    }

    public consumeSignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
        const pattern = { cmd: 'SIWE/CONSUME', role: 'user' };
        return this.client.send(pattern, verifySignatureDto).pipe(catchError(sendRPCError));
    }
}
