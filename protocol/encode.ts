import type { ExtPointType } from '@noble/curves/abstract/edwards';
import { RandomPoint, RandomScalar, type SeededRNG } from './random';
import { bytesToHex, bytesToNumberLE } from '@noble/curves/abstract/utils';
import { ed25519, encodeToCurve } from '@noble/curves/ed25519';

export function StrToBytes(s: string): Uint8Array {
    return Uint8Array.from(s.split('').map(x => x.charCodeAt(0)));
}

export function BytesToStr(b: Uint8Array): string {
    return new TextDecoder("utf-8").decode(b);
}

export function PointToPlaintext(plaintextPoint: ExtPointType): Uint8Array {
    const plaintext = plaintextPoint.toRawBytes();
    if (plaintext[0] > plaintext.length) {
        return StrToBytes("unknown");
    }
    return plaintext.subarray(1, plaintext[0]+1);
}

export function MessageToPoint(message: Uint8Array, rng: SeededRNG): ExtPointType {
    if (message.length > 28) {
		throw("message to big to embed, must be less than 32 bytes!")
	}

	// We have to trial and error the point selection
	while(true) {
        var buf = RandomScalar(rng);
		buf[0] = message.length & 0xFF;

        for (let i = 0; i < message.length; i++) {
            const idx = i + 1;
            buf[idx] = message[i];
        }

        try {
            const hex = bytesToHex(buf);
            const pt = ed25519.ExtendedPoint.fromHex(hex);
            return pt;
        } catch (e) { 
            // console.log(e); 
        }
	}
}

const maxScalar = 7237005577332262213973186563042994240857116359379907606001950938285454250989n;

// ScalarToBigInt is a helper to conver uint8 to bigint in a sane way.
export function ScalarToBigInt(scalar: Uint8Array): bigint {
    let result = BigInt(0);
    for (let i = scalar.length - 1; i >= 0; i--) {
        result = result * BigInt(256) + BigInt(scalar[i]);
    }

    if (result > maxScalar) {
        return result % maxScalar;
    }

    return result;
}