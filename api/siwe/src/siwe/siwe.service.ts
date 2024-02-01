import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {VerifySignatureDto} from './siwe.dto';
import {FIFOSetService} from './fifoset.service';
import { Observable} from 'rxjs';
import {verifySignature} from "./methods/verifySignature";
import {consumeSignature} from "./methods/consumeSignature";
import {processSignature} from "./methods/processSignature";

@Injectable()
class SiweService implements OnModuleInit {
    private readonly logger = new Logger(SiweService.name);
    public verifySignature: (verifySignatureDto: VerifySignatureDto) => Observable<any>;
    public consumeSignature: (verifySignatureDto: VerifySignatureDto) => Observable<any>;
    public processSignature: (verifySignatureDto: VerifySignatureDto, shouldDestroy?: boolean) => Observable<any>;

    constructor(private readonly fifoSet: FIFOSetService) {
    }

    async onModuleInit(): Promise<void> {
    }
}

SiweService.prototype.consumeSignature = consumeSignature;
SiweService.prototype.verifySignature = verifySignature;
SiweService.prototype.processSignature = processSignature;

export {SiweService};


