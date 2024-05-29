import { twistedEdwards } from "@noble/curves/abstract/edwards";
import type { ExtPointType } from "@noble/curves/abstract/edwards";

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


/*


func randomScalar(rng io.Reader) *edwards25519.Scalar {
	b := make([]byte, 32)
	for {
		n, err := rng.Read(b)
		if err != nil {
			panic(fmt.Sprintf("%+v", err))
		}
		if n != len(b) {
			panic(fmt.Sprintf("short read: %d != %d", n, len(b)))
		}
		s, err := new(edwards25519.Scalar).SetBytesWithClamping(b)
		if err == nil {
			return s
		}
	}
}

func pointFromMessage(message []byte, rng io.Reader) *edwards25519.Point {
	buf := make([]byte, 32)

	// NOTE: the smaller the better here otherwise its guessable what
	// went into the point, we may want to make this artificially only a
	// couple bytes
	if len(message) > len(buf)-1 {
		panic("message to big to embed, must be less than 32 bytes!")
	}

	// We have to trial and error the point selection
	for {
		n, err := rng.Read(buf)
		if err != nil {
			panic(err)
		}
		if n != len(buf) {
			panic(fmt.Sprintf("short read: %d != %d", n, len(buf)))
		}

		buf[0] = byte(len(message))
		copy(buf[1:len(message)+1], message)

		p, err := new(edwards25519.Point).SetBytes(buf)
		if err == nil {
			return p
		}

	}
}

func genkeys(rng io.Reader) (*edwards25519.Scalar, *edwards25519.Point) {
	priv := randomScalar(rng)
	pub := new(edwards25519.Point).ScalarBaseMult(priv)
	return priv, pub
}
*/