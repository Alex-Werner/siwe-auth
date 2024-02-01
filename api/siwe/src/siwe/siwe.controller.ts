import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Req} from "@nestjs/common";
import {MessagePattern, RpcException} from "@nestjs/microservices";
import {catchError, throwError, Observable} from "rxjs";
import {generateNonce} from 'siwe';

import {SiweService} from "./siwe.service";
import {VerifySignatureDto} from "./siwe.dto";
import {FIFOSetService} from "./fifoset.service";

function sendError(e: any) {
    switch (e?.status) {
        case 400:
            return throwError(() => new HttpException(e.message, HttpStatus.BAD_REQUEST));
        default:
            return throwError(() => new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}

function sendRPCError(e: any) {
    switch (e?.status) {
        case 400:
            return throwError(() => new RpcException(new BadRequestException(e.message)));
        default:
            return throwError(() => new RpcException(new BadRequestException(e.message)));
    }
}

@Controller('/siwe')
export class SIWEController {
    private readonly logger = new Logger(SIWEController.name);

    constructor(
        private readonly siweService: SiweService,
        private readonly fifoSet: FIFOSetService,
        ) {
    }


    @Get('/nonce')
    @MessagePattern({role: 'user', cmd: 'SIWE/NONCE/GET'})
    getNonce(
        @Req() req: Request,
    ): { nonce: string } {
        this.logger.debug(`GET /siwe/nonce - Nonce request`);
        const nonce = generateNonce();
        this.fifoSet.add(nonce);
        this.logger.debug(`ADDED NONCE ${nonce}`)
        return {nonce};
    }

    @MessagePattern({role: 'user', cmd: 'SIWE/CONSUME'})
    consumeSiwe(
        @Body() verifySignatureDto: VerifySignatureDto,
    ): Observable<any> {
        this.logger.debug(`POST /siwe/consume - Consuming message / nonce`);
        return this.siweService
            .consumeSignature({...verifySignatureDto, destroy: true})
            .pipe(catchError(sendRPCError));
    }

    @Post('/verify')
    @MessagePattern({role: 'user', cmd: 'SIWE/VERIFY'})
    verifyNonce(
        @Body() verifySignatureDto: VerifySignatureDto,
    ): Observable<any> {
        this.logger.debug(`POST /siwe/verify - Verifying message / nonce`, verifySignatureDto);
        return this.siweService
            .verifySignature(verifySignatureDto)
            .pipe(catchError(sendError));

    }

}
