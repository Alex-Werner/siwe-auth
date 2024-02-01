import {VerifySignatureDto} from "../siwe.dto";
import {from, Observable} from 'rxjs';

export function consumeSignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
    return from(this.processSignature(verifySignatureDto));
}
