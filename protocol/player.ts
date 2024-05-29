import { ExtPointType } from "@noble/curves/abstract/edwards"
import { EncryptedCard } from "./cards"
import { SharedSecret } from "./edwards";
import { GenerateKeys, KeyPair, SeededRNG, Shuffle } from "./random";



// ShuffleAndDecrypt does a few things:
// 1. Decrypt the card ephemeral public key, C1 
// 2. Partially decrypts the card using the private key 
//    for the public key that they advertised during StartHand. (C2)
// 3. Shuffles the cards. 
// 4. Chooses a new random key and re-encrypts the card ephemeral public key, C1
export function ShuffleAndDecrypt(inDeck: EncryptedCard[],
	curPlayer: Uint8Array, nextPlayer: ExtPointType|null,
	rng: SeededRNG): EncryptedCard[] {

	var outDeck = new Array<EncryptedCard>(inDeck.length);

	// Decrypt C1 from the previous hop
	for (const i of inDeck.keys()) {
		let secret = SharedSecret(curPlayer, inDeck[i].In);
		inDeck[i].C1 = inDeck[i].C1.subtract(secret);
	}

	// Remove my encryption
	for (const i of inDeck.keys()) {
		let secret = SharedSecret(curPlayer, inDeck[i].C1);
		inDeck[i].C2 = inDeck[i].C2.subtract(secret);
	}

	// Shuffle
	let permutation = Shuffle(inDeck.length, rng);
	for (const i of permutation.keys()) {
		outDeck[i] = inDeck[permutation[i]]
	}

	// Encrypt for the next hop, if there is one
	if (!nextPlayer) {
		return outDeck
	}

	for (const i of outDeck.keys()) {
		let ephKeys = GenerateKeys(rng);
		let secret = SharedSecret(ephKeys.Private, nextPlayer);
		outDeck[i].In = ephKeys.Public;
		outDeck[i].C1 = outDeck[i].C1.add(secret);
	}

	return outDeck;
}
