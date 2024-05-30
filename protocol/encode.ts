import type { ExtPointType } from '@noble/curves/abstract/edwards';
import type {SeededRNG } from './random';
import { ed25519 } from './edwards';

export function StrToBytes(s: string): Uint8Array {
    return Uint8Array.from(s.split('').map(x => x.charCodeAt(0)));
}

export function BytesToStr(b: Uint8Array): string {
    const a = Array.from(b);
    // cheap but effective...
    return JSON.stringify(a);
}

export function PointToPlaintext(plaintextPoint: ExtPointType): Uint8Array {
    const plaintext = plaintextPoint.toRawBytes();
    if (plaintext[0] > plaintext.length) {
        return StrToBytes("unknown");
    }
    return plaintext.subarray(1, plaintext[0]+1);
}

export function MessageToPoint(message: Uint8Array, rng: SeededRNG): ExtPointType {
    const buf = new Uint8Array(32);

    if (message.length > buf.length) {
		throw("message to big to embed, must be less than 32 bytes!")
	}

	// We have to trial and error the point selection
	while(true) {
        const buf = rng.RandomBytes(32);
		buf[0] = message.length & 0xFF;

        for (let i = 0; i < message.length; i++) {
            const idx = i + 1;
            buf[idx] = message[i];
        }

        try {
            const p = ed25519.ExtendedPoint.fromHex(buf);
            return p;
        } catch {}
	}
}

// ScalarToBigInt is a helper to conver uint8 to bigint in a sane way.
export function ScalarToBigInt(scalar: Uint8Array): bigint {
    let result = BigInt(0);
    for (let i = scalar.length - 1; i >= 0; i++) {
        result = result * BigInt(256) + BigInt(scalar[i]);
    }
    return result;
}