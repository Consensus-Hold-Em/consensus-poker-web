import type { ExtPointType } from '@noble/curves/abstract/edwards';
import { GenerateKeys, RandomScalar, SeededRNG } from './random';
import { Encrypt, SharedSecret, ed25519 } from './edwards';
import { ScalarToBigInt } from './encode';

export const cards = new Array("Ace", "King", "Queen", "Jack", "10",
"9", "8", "7", "6", "5", "4", "3", "2");
export const suites = new Array("Clubs", "Diamonds", "Hearts", "Spades");

export const CardNames = {
    PlayerCards: Array<string>("Card1", "Card2"),
    FlopCards: Array<string>("Flop1", "Flop2", "Flop3"),
    River: "River",
    Turn: "Turn"
}

export type EncryptedCard = {
	// In is the public key used to encrypt C1 with the next player
	In: ExtPointType,
	// C1 is r*G where r was chosen by the player
	// essentially its a public key for the card used
	// with all 3 player keys, but re-encrypted at each
	// player hop to protect permutation
	// NOTE: pretty sure player 0 can share this with last
	// player to reveal permutation, so will need to fix this
	C1: ExtPointType,
	// C2 is the M + pubkey * r for each player
	C2: ExtPointType
}

// DeckReference returns a mapping of integer position to the name of the 
// card represented by that integer.
export function DeckReference(): string[] {
    const numCards = cards.length * suites.length;
    var deck = new Array<string>(numCards);
    for (let i = 0; i < suites.length; i++) {
        for (let j = 0; j < cards.length; j++) {
            const c = cards[j];
            deck[i*cards.length+j] = c + " of " + suites[i]
        }
    }
    return deck;
}

// InitCards returns a uniform ordering based on the number of players.
export function InitCards(numPlayers: number, numCards: number): string[] {
	var res = new Array<string>(numCards);
	var curCard = 0;

	// First Card
	for (let i = 0; i < numPlayers; i++) {
		res[curCard] = "P" + i + CardNames.PlayerCards[0];
		curCard += 1;
	}

	// Trash Card 1
	res[curCard] = "Trashed1";
	curCard += 1;

	// Second Card
	for (let i = 0; i < numPlayers; i++) {
		res[curCard] = "P" + i + CardNames.PlayerCards[1];
		curCard += 1;
	}

	// Trash Card 2
	res[curCard] = "Trashed2";
	curCard += 1;
	// Trash Card 3;
	res[curCard] = "Trashed3";
	curCard += 1;

	// Flop
	for (let i = 0; i < 3; i++) {
		res[curCard] = CardNames.FlopCards[i];
		curCard += 1;
	}

	// Turn
	res[curCard] = CardNames.Turn;
	curCard += 1;

	// River
	res[curCard] = CardNames.River;
	curCard += 1;

	for (let i = curCard; i < numCards; i++) {
		res[i] = "Unselected";
	}
	return res
}

// To encrypt, we encrypt for each public key with the same random
// constant, this creates an elgamal pattern of M + rY1 + rYn...
// Then the "c1" is encrypted with an input key which each node changes
// And we add a secret to the end of that. When it comes out of the mix
// the card
// (NOTE: this needs validation and security review to be sure it's
// safe, but we're hackathoning here so we let it go for now)
// In particular sharing the same c1 means collusion is a problem but
// for now we assume the players don't do that, I will need to review
// cMix et al to remember how that is fixed.
export function EncryptPlayerCard(playerPubKeys: ExtPointType[], rng: SeededRNG,
	cardPoint: ExtPointType, cardSecret: ExtPointType): EncryptedCard {

	// The "Message" is the card and the secret, this is what pops
	// out of the mix, and the player can find which one it is
	// by subtracting their secret.
    let m = cardSecret.add(cardPoint);

    // m := cardPoint
	// the 'r' value in C1, which gets re-encrypted at each hop
	// note: weakness here
	let r = RandomScalar(rng);
    let c1pt = ed25519.ExtendedPoint.BASE.multiply(ScalarToBigInt(r));

	var c2 = Encrypt(r, playerPubKeys[0], m)
	for (let i = 1; i < playerPubKeys.length; i++) {
		let s = SharedSecret(r, playerPubKeys[i])
		c2 = c2.add(s)
	}

	let keys = GenerateKeys(rng);
	return {
		In: keys.Public,
		C1: Encrypt(keys.Private, playerPubKeys[0], c1pt),
		C2: c2,
	}
}

// Pool cards are encrypted for the network by player 0, then each player
// encrypts with a unique secret on top.
export function EncryptPoolCardP0(privKey: Uint8Array,
	playerPubKeys: ExtPointType[],
	rng: SeededRNG, cardPoint: ExtPointType): EncryptedCard {

	let r = RandomScalar(rng);
	let c1pt = ed25519.ExtendedPoint.BASE.multiply(ScalarToBigInt(r));

	var c2 = Encrypt(r, playerPubKeys[0], cardPoint);
	for (let i = 1; i < playerPubKeys.length; i++) {
		let s = SharedSecret(r, playerPubKeys[i]);
		c2 = c2.add(s);
	}
	// Add my encryption
	let s2 = SharedSecret(privKey, playerPubKeys[0]);
	c2 = c2.add(s2);

	let keys = GenerateKeys(rng);
	return {
		In: keys.Public,
		C1: Encrypt(keys.Private, playerPubKeys[0], c1pt),
		C2: c2,
	}
}

export function EncryptPoolCardPN(privKey: Uint8Array,
	myPubKey: ExtPointType,
	card: EncryptedCard): EncryptedCard {
	let s = SharedSecret(privKey, myPubKey);
	card.C2 = card.C2.add(s);
	return card;
}
