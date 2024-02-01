import {VerifySignatureDto} from "../siwe.dto";
import {from, Observable} from "rxjs";

export function verifySignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
    return from(this.processSignature(verifySignatureDto, false));
}
