import { ExtPointType } from '@noble/curves/abstract/edwards';
import { ScalarToBigInt } from './encode';
import { ed25519, edwardsToMontgomery, edwardsToMontgomeryPriv, edwardsToMontgomeryPub, x25519 } from '@noble/curves/ed25519';
import { montgomery } from '@noble/curves/abstract/montgomery';

export function Encrypt(myPriv: Uint8Array, theirPub: ExtPointType,
     msgPoint: ExtPointType): ExtPointType {
    let secret = SharedSecret(myPriv, theirPub);
	let ciphertext = msgPoint.add(secret);
	return ciphertext
}

// sharedSecret is used to reveal how to decrypt to others
export function SharedSecret(privKey: Uint8Array,
	ephPubKey: ExtPointType): ExtPointType {
        let pub = edwardsToMontgomeryPub(ephPubKey.toRawBytes());
        let prv = edwardsToMontgomeryPriv(privKey);
        let shared = x25519.getSharedSecret(prv, pub)
        return ed25519.ExtendedPoint.fromPrivateKey(shared);
        // return ephPubKey.multiply(ScalarToBigInt(privKey));
}

// decrypt derives the secret with the eph pubkey then calculates the
// input message
export function Decrypt(privKey: Uint8Array, ephPubKey: ExtPointType,
	ciphertext: ExtPointType): ExtPointType {
	let secret = SharedSecret(privKey, ephPubKey);
	return ciphertext.subtract(secret);
}
