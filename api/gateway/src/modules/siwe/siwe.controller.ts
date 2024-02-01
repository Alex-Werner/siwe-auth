import {Body, Controller, Get, HttpException, HttpStatus, Logger, Post} from "@nestjs/common";
import {SiweService} from "./siwe.service";
import {catchError, throwError, Observable} from "rxjs";
import {ConfigService} from "@nestjs/config";
import {VerifySignatureDto} from "./siwe.dto";
import {SiweMessage} from "siwe";

function sendError(e: { status: number, message: string }) {
    switch (e?.status) {
        case 400:
            return throwError(() => new HttpException(e.message, HttpStatus.BAD_REQUEST));
        default:
            return throwError(() => new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR));
    }
}

@Controller('/siwe')
export class SIWEController {
    private readonly logger = new Logger(SIWEController.name);

    constructor(
        private readonly siweService: SiweService,
        private readonly configService: ConfigService) {

    }


    @Get('/nonce')
    getNonce(): Observable<{ message: SiweMessage; nonce: string }> {
        this.logger.debug(`= GET /siwe/nonce - Nonce request`);
        return this.siweService
            .requestNonce()
            .pipe(catchError(sendError));
    }

    @Post('/verify')
    verifyNonce(
        @Body() verifySignatureDto: VerifySignatureDto,
    ): Observable<{
        success: boolean,
    }> {
        this.logger.debug(`= GET /siwe/verify - Verifying message ${JSON.stringify(verifySignatureDto)}`);

        return this.siweService
            .verifySignature(verifySignatureDto)
            .pipe(catchError(sendError));

    }

}
