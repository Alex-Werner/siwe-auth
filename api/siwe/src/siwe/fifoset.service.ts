import { Injectable } from '@nestjs/common';
import FIFOSet from './primitives/FIFOSet';

@Injectable()
export class FIFOSetService extends FIFOSet {
    constructor() {
        super(1000);
    }
}
