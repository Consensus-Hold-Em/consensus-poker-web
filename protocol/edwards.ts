import { ExtPointType, twistedEdwards } from '@noble/curves/abstract/edwards';
import { Field } from '@noble/curves/abstract/modular';
import { sha512 } from '@noble/hashes/sha512';
import { randomBytes } from '@noble/hashes/utils';
import { ScalarToBigInt } from './encode';

const Fp = Field(2n ** 255n - 19n);
export const ed25519 = twistedEdwards({
  a: Fp.create(-1n),
  d: Fp.div(-121665n, 121666n), // -121665n/121666n mod p
  Fp: Fp,
  n: 2n ** 252n + 27742317777372353535851937790883648493n,
  h: 8n,
  Gx: 15112221349535400772501151409588531511454012693041857206046113283949847762202n,
  Gy: 46316835694926478169428394003475163141307993866256225615783033603165251855960n,
  hash: sha512,
  randomBytes,
  adjustScalarBytes(bytes) {
    // optional; but mandatory in ed25519
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  },
} as const);

export function Encrypt(myPriv: Uint8Array, theirPub: ExtPointType,
     msgPoint: ExtPointType): ExtPointType {
    let secret = SharedSecret(myPriv, theirPub);
	let ciphertext = secret.add(msgPoint);
	return ciphertext
}

// sharedSecret is used to reveal how to decrypt to others
export function SharedSecret(privKey: Uint8Array,
	ephPubKey: ExtPointType): ExtPointType {
        return ephPubKey.multiply(ScalarToBigInt(privKey));
}

// decrypt derives the secret with the eph pubkey then calculates the
// input message
export function Decrypt(privKey: Uint8Array, ephPubKey: ExtPointType,
	ciphertext: ExtPointType): ExtPointType {
	let secret = SharedSecret(privKey, ephPubKey);
	return ciphertext.subtract(secret);
}
