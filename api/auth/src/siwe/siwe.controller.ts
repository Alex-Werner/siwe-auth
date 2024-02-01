import {Controller, Post} from "@nestjs/common";
import {VerifySignatureDto} from "./siwe.dto";
import {SiweService} from "./siwe.service";
import {Observable} from "rxjs";

@Controller('/siwe')
export class SiweController {
    constructor(
        private readonly siweService: SiweService) {
    }

    @Post('/verify')
    verifyNonce(
        verifySignatureDto: VerifySignatureDto,
    ): Observable<any> {
        return this.siweService
            .verifySignature(verifySignatureDto)
    }

    @Post('/consume')
    consumeNonce(
        verifySignatureDto: VerifySignatureDto,
    ): Observable<any> {
        return this.siweService
            .consumeSignature(verifySignatureDto)
    }

}
