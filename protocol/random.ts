import { keccak_256 } from "@noble/hashes/sha3";
import { randomBytes } from '@noble/ciphers/webcrypto';
import type { ExtPointType } from "@noble/curves/abstract/edwards";
import { x25519 } from '@noble/curves/ed25519';

type SeededRNG = { 
    curState: Uint8Array;
    seed: Uint8Array;
    Forward: () => Uint8Array;
    RandomBytes: (numBytes: number) => Uint8Array;
}

function NewSeed(): Uint8Array {
    return randomBytes(32);
}

function NewSeededRNG(seed: Uint8Array): SeededRNG {
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

function ReadRange(start: number, end: number, rng: SeededRNG): number {
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

function RandomPoint(rng: SeededRNG): Uint8Array {
    const b = rng.RandomBytes(32);
    return x25519.getPublicKey(b);
}

/*
func randomScalar(rng io.Reader) *edwards25519.Scalar {
    const b = rng.RandomBytes(32);
}

*/