import type { ExtPointType } from '@noble/curves/abstract/edwards';
import type {SeededRNG } from './random';
import { ed25519 } from './edwards';

function strToBytes(s: string): Uint8Array {
    return Uint8Array.from(s.split('').map(x => x.charCodeAt(0)));
}

function PointToPlaintext(plaintextPoint: ExtPointType): Uint8Array {
    const plaintext = plaintextPoint.toRawBytes();
    if (plaintext[0] > plaintext.length) {
        return strToBytes("unknown");
    }
    return plaintext.subarray(1, plaintext[0]+1);
}

function MessageToPoint(message: Uint8Array, rng: SeededRNG): ExtPointType {
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
