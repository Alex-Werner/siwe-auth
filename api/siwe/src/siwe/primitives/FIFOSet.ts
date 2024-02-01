/**
 * Exception class for handling cases where a nonce exceeds the expected length.
 */
class NonceLengthExceedExpectedException extends Error {
    constructor(expectedLength: number) {
        const message = `Nonce length must be less than ${expectedLength}`;
        super(message);
        this.name = "NonceLengthExceedExpectedException";
    }
}

/**
 * Ensures that the length of a nonce does not exceed a specified limit.
 * Throws an error if the nonce is too long.
 * @param {string} nonce - The nonce to validate.
 * @param {number} [expectedLength=20] - The maximum allowable length of the nonce.
 */
export function ensureNonceLength(nonce: string, expectedLength: number = 20): void {
    if (nonce.length >= expectedLength) {
        throw new NonceLengthExceedExpectedException(expectedLength);
    }
}

/**
 * A FIFO set implementation.
 * This class is used to store nonces in a FIFO manner.
 * It is used to ensure that nonces are not reused.
 * @class
 */
class FIFOSet {
    private queue: string[];
    private map: Map<string, boolean>;
    private readonly maxSize: number;

    /**
     * Constructs a FIFOSet.
     * @param {number} [maxSize=500] - The maximum size of the FIFO set.
     */
    constructor(maxSize: number = 500) {
        this.queue = [];
        this.map = new Map();
        this.maxSize = maxSize;
    }

    /**
     * Adds a nonce to the FIFO set.
     * If the set reaches its maximum size, the oldest nonce is removed.
     * @param {string} nonce - The nonce to add.
     */
    public add(nonce: string): void {
        // Sanity check
        ensureNonceLength(nonce);

        if (this.map.has(nonce)) {
            return;
        }

        if (this.queue.length === this.maxSize) {
            const oldest = this.queue.shift();
            if (oldest !== undefined) {
                this.map.delete(oldest);
            }
        }

        // Nonce added in the queue for fifo aspect, and in the map for quick lookup
        this.queue.push(nonce);
        this.map.set(nonce, true);
    }

    /**
     * Removes a nonce from the FIFO set.
     * @param {string} nonce - The nonce to remove.
     */
    public remove(nonce: string): void {
        ensureNonceLength(nonce);

        if (!this.map.has(nonce)) {
            return;
        }

        // Remove the nonce from both the queue and the map
        this.queue = this.queue.filter(n => n !== nonce);
        this.map.delete(nonce);
    }

    /**
     * Checks if a nonce exists in the FIFO set.
     * @param {string} nonce - The nonce to check.
     * @returns {boolean} - Returns true if the nonce exists, false otherwise.
     */
    public has(nonce: string): boolean {
        return this.map.has(nonce);
    }

}
export default FIFOSet;
