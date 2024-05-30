import { ExtPointType } from "@noble/curves/abstract/edwards"
import { CardNames, EncryptPlayerCard, EncryptPoolCardP0, EncryptPoolCardPN, EncryptedCard, InitCards } from "./cards"
import { SharedSecret } from "./edwards";
import { GenerateKeys, KeyPair, NewSeededRNG, RandomPoint, RandomScalar, SeededRNG, Shuffle } from "./random";
import { BytesToStr, MessageToPoint, PointToPlaintext, StrToBytes } from "./encode";
import { generateKeyPair } from "crypto";
import { ed25519 } from "@noble/curves/ed25519";

export type InitialHandState = {
    Player: EncryptedCard[]|null, // len of 2, null for other players
    Flop: EncryptedCard[], // len of 3
    River: EncryptedCard,
    Turn: EncryptedCard
};

export type PlayerKeys = {
    myPublishedKeys: KeyPair,
    myCards: ExtPointType[], // len of 2
    flop: Uint8Array[] // len of 3
    turn: Uint8Array,
    river: Uint8Array
};

const dummyRNG = NewSeededRNG(new Uint8Array(0));

function UnencryptedCard(cardName: string, rng: SeededRNG): EncryptedCard {
    return {
        In: RandomPoint(rng),
        C1: RandomPoint(rng),
        C2: MessageToPoint(StrToBytes(cardName), rng),
    }
}

export function GenPlayerKeys(rng: SeededRNG): PlayerKeys {
    return {
        myPublishedKeys: GenerateKeys(rng),
        myCards: Array<ExtPointType>(
            RandomPoint(rng),
            RandomPoint(rng)
        ), 
        flop: Array<Uint8Array>(
            RandomScalar(rng),
            RandomScalar(rng),
            RandomScalar(rng)
        ),
        turn: RandomScalar(rng),
        river: RandomScalar(rng)   
    }
}

export function StartHand(playerIndex: number, myKeys: PlayerKeys, 
    prevPlayerState: InitialHandState | null,
    playerPubKeys: ExtPointType[], rng: SeededRNG): InitialHandState {
    var cards: InitialHandState;
    if (prevPlayerState) {
        cards = {
            Player: Array<EncryptedCard>(2),
            Flop: prevPlayerState.Flop,
            River: prevPlayerState.River,
            Turn: prevPlayerState.Turn
        }
    } else {
        cards = {
            Player: Array<EncryptedCard>(2),
            Flop: Array<EncryptedCard>(
                UnencryptedCard(CardNames.FlopCards[0], dummyRNG),
                UnencryptedCard(CardNames.FlopCards[1], dummyRNG),
                UnencryptedCard(CardNames.FlopCards[2], dummyRNG),
            ),
            River: UnencryptedCard(CardNames.River, dummyRNG),
            Turn: UnencryptedCard(CardNames.Turn, dummyRNG),
        }
        
    }
    const numPlayers = playerPubKeys.length;

    const emptyCardState = InitCards(numPlayers, 52);

    const p0CardIdx = playerIndex;
    const p0Card = MessageToPoint(StrToBytes(emptyCardState[p0CardIdx]), rng);
    cards.Player![0] = EncryptPlayerCard(playerPubKeys, rng, p0Card, myKeys.myCards[0]);

    const p1CardIdx = playerIndex + numPlayers + 1;
    const p1Card = MessageToPoint(StrToBytes(emptyCardState[p1CardIdx]), rng);
    cards.Player![1] = EncryptPlayerCard(playerPubKeys, rng, p1Card, myKeys.myCards[1]);

    for (const i of cards.Flop.keys()) {
        if (playerIndex == 0) {
            cards.Flop[i] = EncryptPoolCardP0(myKeys.flop[i], playerPubKeys, 
                rng, cards.Flop[i].C2);
        } else {
            cards.Flop[i] = EncryptPoolCardPN(myKeys.flop[i], myKeys.myPublishedKeys.Public, 
                cards.Flop[i]);
        }
    }

    if (playerIndex == 0) {
        cards.Turn = EncryptPoolCardP0(myKeys.turn, playerPubKeys, 
            rng, cards.Turn.C2);
        cards.River = EncryptPoolCardP0(myKeys.river, playerPubKeys, 
            rng, cards.River.C2);
    } else {
        cards.Turn = EncryptPoolCardPN(myKeys.turn, myKeys.myPublishedKeys.Public, 
            cards.Turn);
        cards.River = EncryptPoolCardPN(myKeys.river, myKeys.myPublishedKeys.Public, 
            cards.River);
    }

    return cards;
}

export function AssembleDeck(initialStates: InitialHandState[], 
    rng: SeededRNG): EncryptedCard[] {
    const numPlayers = initialStates.length;
    const cards = InitCards(numPlayers, 52);
    var deck = new Array<EncryptedCard>(cards.length);
    for (const i of deck.keys()) {
        deck[i] = UnencryptedCard(cards[i], rng);
    }

    for (let i = 0; i < numPlayers; i++) {
        const pCard1Idx = i;
        deck[pCard1Idx] = initialStates[i].Player![0];
        const pCard2Idx = i + numPlayers + 1;
        deck[pCard2Idx] = initialStates[i].Player![1];
        // console.log("STATES " + i + '.' + pCard1Idx + '.' + pCard2Idx);
        // console.log(BytesToStr(PointToPlaintext(deck[pCard1Idx].C2)));
        // console.log(BytesToStr(PointToPlaintext(deck[pCard2Idx].C2)));
    }

    const firstFlopIdx = 2*numPlayers + 3;
    const pool = initialStates[numPlayers-1];
    for (let i = 0; i < 3; i++) {
        deck[firstFlopIdx+i] = pool.Flop[i];
    }
    deck[firstFlopIdx+3] = pool.Turn;
    deck[firstFlopIdx+4] = pool.River;
    return deck;
}

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

export function FindPlayerCard(deck: EncryptedCard[],
    cardSecret: ExtPointType, cardName: string): number {
    for (const i of deck.keys()) {
        const cur = deck[i];
        let curC2 = ed25519.ExtendedPoint.fromHex(cur.C2.toHex());
        curC2 = curC2.subtract(cardSecret);
        const test = BytesToStr(PointToPlaintext(curC2));
        if (test == cardName) {
            return i;
        }
        // console.log(cardName + " != " + test);
    }
    throw("could not find card");
}

export function FindPoolCard(deck: EncryptedCard[],
    privKeys: Uint8Array[], playerPubKeys: ExtPointType[],
     cardName: string): number {
    var secret = ed25519.ExtendedPoint.ZERO;
    for (const i of privKeys.keys()) {
        secret = secret.add(SharedSecret(privKeys[i], playerPubKeys[i]));
    }

    return FindPlayerCard(deck, secret, cardName);
}