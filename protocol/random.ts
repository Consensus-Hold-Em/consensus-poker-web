import { keccak_256 } from "@noble/hashes/sha3";
import { randomBytes } from '@noble/ciphers/webcrypto';
import { ExtPointType } from "@noble/curves/abstract/edwards";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { ed25519, encodeToCurve, hashToCurve } from "@noble/curves/ed25519";
import { ScalarToBigInt } from "./encode";

export type SeededRNG = { 
    curState: Uint8Array;
    seed: Uint8Array;
    Forward: () => Uint8Array;
    RandomBytes: (numBytes: number) => Uint8Array;
}

export type KeyPair = {
    Public: ExtPointType,
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
            this.Forward();
            return this.curState.subarray(0, numBytes);
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
        Public: ed25519.ExtendedPoint.fromPrivateKey(p)
    }
}

export function RandomPoint(rng: SeededRNG): ExtPointType {
    const b = rng.RandomBytes(32);
    return ed25519.ExtendedPoint.fromPrivateKey(b);
}

export function RandomScalar(rng: SeededRNG): Uint8Array {
    let bytes = rng.RandomBytes(32);
    // optional; but mandatory in ed25519
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
}

// Standard FY Shuffle algorithm
export function Shuffle(numCards: number, rng: SeededRNG): number[] {
    let cards = new Array(numCards);
    for (let i = 0; i < numCards; i++) {
        cards[i] = i;
    }

	for (let i = numCards - 1; i > 0; i--) {
		let j = ReadRange(0, i, rng);
		let swap = cards[j]
		cards[j] = cards[i]
		cards[i] = swap
	}
	return cards
}
