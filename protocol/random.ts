import { keccak_256 } from "@noble/hashes/sha3";
import { randomBytes } from '@noble/ciphers/webcrypto';
import { ed25519 } from './edwards';
import { ExtPointType } from "@noble/curves/abstract/edwards";

export type SeededRNG = { 
    curState: Uint8Array;
    seed: Uint8Array;
    Forward: () => Uint8Array;
    RandomBytes: (numBytes: number) => Uint8Array;
}

export type KeyPair = {
    Public: Uint8Array,
    Private: Uint8Array
}

export function NewSeed(): Uint8Array {
    return randomBytes(32);
}

export function NewSeededRNG(seed: Uint8Array): SeededRNG {
    var startState: Uint8Array = keccak_256(seed);
    var rng: SeededRNG = {
        curState: startState,
        seed: seed,
        Forward: function(this: SeededRNG): Uint8Array {
            const nextState = keccak_256(this.curState);
            this.curState = nextState;
            return nextState;
        },
        RandomBytes(this: SeededRNG, numBytes: number): Uint8Array {
            // FIXME: this maxes out at 32 but we never ask for moe than that
            return rng.Forward().subarray(0, numBytes);
        }
    }
    return rng;
}

export function ReadRange(start: number, end: number, rng: SeededRNG): number {
    const size = end - start;
    const max = 2**32 - 1;

    const extra = (max%size+1)%size;
    const limit = max - extra;
    // Loop until we read something inside the limit
    while(true) {
        const res = (new Uint32Array( rng.RandomBytes(4) ))[0];
        if (res <= limit) {
            return (res % size) + start
        }
    }
}

export function GenerateKeys(rng: SeededRNG): KeyPair {
    const p = rng.RandomBytes(32);
    return {
        Private: p,
        Public: ed25519.getPublicKey(p)
    }
}

export function RandomPoint(rng: SeededRNG): ExtPointType {
    while(true) {
        const b = rng.RandomBytes(32);
        try {
            const p = ed25519.ExtendedPoint.fromHex(b);
            return p;
        } catch {}
    }
}

export function RandomScalar(rng: SeededRNG): Uint8Array {
    const bytes = rng.RandomBytes(32);
    // optional; but mandatory in ed25519
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
}

