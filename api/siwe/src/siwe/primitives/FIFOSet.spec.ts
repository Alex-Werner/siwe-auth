import FIFOSet from './FIFOSet';

describe('FIFOSet', () => {
    let fifoSet: FIFOSet;

    beforeEach(() => {
        fifoSet = new FIFOSet();
    });

    it('should add a nonce', () => {
        fifoSet.add('nonce1');
        expect(fifoSet.has('nonce1')).toBeTruthy();
    });

    it('should not add a duplicate nonce', () => {
        fifoSet.add('nonce1');
        fifoSet.add('nonce1');
        expect([...fifoSet['queue']].filter(n => n === 'nonce1').length).toBe(1);
    });

    it('should remove a nonce', () => {
        fifoSet.add('nonce1');
        fifoSet.remove('nonce1');
        expect(fifoSet.has('nonce1')).toBeFalsy();
    });

    it('should maintain the size within the max limit', () => {
        const maxSize = 5;
        const testFIFOSet = new FIFOSet(maxSize);
        for (let i = 0; i < maxSize + 2; i++) {
            testFIFOSet.add('nonce' + i);
        }
        expect(testFIFOSet['queue'].length).toBe(maxSize);
        // The oldest nonces has been removed
        expect(testFIFOSet.has('nonce0')).toBeFalsy();
        expect(testFIFOSet.has('nonce1')).toBeFalsy();
    });
});

