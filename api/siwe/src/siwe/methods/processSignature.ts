import { VerifySignatureDto } from "../siwe.dto";
import { RpcException } from "@nestjs/microservices";
import { BadRequestException } from "@nestjs/common";
import { SiweMessage } from "siwe";
import { Observable, from } from 'rxjs';

export function processSignature(verifySignatureDto: VerifySignatureDto, shouldDestroy = true): Observable<any> {
    return from((async () => {
        if (!verifySignatureDto.message || !verifySignatureDto.signature) {
            throw new RpcException(new BadRequestException('Message or signature not found'));
        }

        const message = new SiweMessage(verifySignatureDto.message);
        const nonce = message.nonce;

        if (!this.fifoSet.has(nonce)) {
            this.logger.debug(`Nonce expired: ${nonce}`);
            throw new RpcException(new BadRequestException('Nonce expired. Please request a new nonce'));
        }

        if (verifySignatureDto.address.toLowerCase() !== message.address.toLowerCase()) {
            throw new RpcException(new BadRequestException(`Address does not match: ${verifySignatureDto.address} !== ${message.address}`));
        }

        if (shouldDestroy && verifySignatureDto.destroy) {
            this.logger.debug(`Removing nonce: ${nonce}`);
            this.fifoSet.remove(nonce);
        }

        const signature = verifySignatureDto.signature.toString();

        try {
            const verifyResult = await message.verify({ signature });
            return { success: verifyResult.success };
        } catch (e) {
            throw new RpcException(e);
        }
    })());
}
