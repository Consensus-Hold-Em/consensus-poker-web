import { CardNames, DeckReference, EncryptPlayerCard } from "../protocol/cards";
import { GenerateKeys, NewSeed, NewSeededRNG, RandomPoint, RandomScalar, SeededRNG } from "../protocol/random";
import { AssembleDeck, FindPlayerCard, FindPoolCard, GenPlayerKeys, InitialHandState, ShuffleAndDecrypt, StartHand, type PlayerKeys } from "../protocol/player";
import { ExtPointType } from "@noble/curves/abstract/edwards";
import { BytesToStr, MessageToPoint, PointToPlaintext, StrToBytes } from "../protocol/encode";
import { Decrypt, Encrypt, SharedSecret } from "../protocol/edwards";

describe('Crypto Tests', () => {
  test('Full Poker Hand with 5 Players', () => {
    const reference = DeckReference();
    for (const i of reference.keys()) {
        for (let j = i+1; j < reference.length; j++) {
            expect(reference[i] == reference[j]).toBe(false);
        }
    }

    let rng = NewSeededRNG(NewSeed());
    let test = RandomPoint(rng);

    let inStr = "test";
    let msg = StrToBytes(inStr);
    let pt = MessageToPoint(msg, rng);
    let out = PointToPlaintext(pt);
    let outStr = BytesToStr(out);
    expect(outStr).toEqual(inStr);

    let kp1 = GenerateKeys(rng);
    let kp2 = GenerateKeys(rng);
    let kp3 = GenerateKeys(rng);
    // test shared secret
    let s1 = SharedSecret(kp1.Private, kp2.Public);
    let s2 = SharedSecret(kp2.Private, kp1.Public);
    expect(s1.toRawBytes()).toEqual(s2.toRawBytes());



    let c = Encrypt(kp1.Private, kp2.Public, pt);
    let c2 = Encrypt(kp1.Private, kp3.Public, c);

    let p2 = Decrypt(kp2.Private, kp1.Public, c2);
    let p = Decrypt(kp3.Private, kp1.Public, p2)
    let out2 = PointToPlaintext(p);
    let outStr2 = BytesToStr(out2);
    expect(outStr2).toEqual(inStr);



    const numPlayers = 3;
    let players = Array<PlayerKeys>(numPlayers);
    for (const i of players.keys()) {
        players[i] = GenPlayerKeys(rng);
    }
    let pubKeys = Array<ExtPointType>(numPlayers);
    for (const i of players.keys()) {
        pubKeys[i] = players[i].myPublishedKeys.Public;
    }

    let hands = new Array<InitialHandState>(numPlayers);
    for (let i = 0; i < numPlayers; i++) {
        hands[i] = StartHand(i,
            players[i],
            i == 0 ? null:hands[i-1],
            pubKeys,
            rng
        );
        // console.log("HANDS")
        // console.log(BytesToStr(PointToPlaintext(hands[i].Player![0].C2)));
        // console.log(BytesToStr(PointToPlaintext(hands[i].Player![1].C2)));
    }

    // card encryption check
    let cardPoint = MessageToPoint(StrToBytes("Card"), rng);
    let cardSecret = RandomPoint(rng);
    let crd = EncryptPlayerCard(pubKeys, rng, cardPoint, cardSecret);
    const c1 = Decrypt(
        players[0].myPublishedKeys.Private,
        crd.In, crd.C1
     );
    for (const i of players.keys()) {
		let secret = SharedSecret(players[i].myPublishedKeys.Private, c1);
		crd.C2 = crd.C2.subtract(secret);
    }
    const curC2 = crd.C2.subtract(cardSecret);
    const c2Str = BytesToStr(PointToPlaintext(curC2));
    // expect(c2Str).toEqual("Card");

    // Player 0 Assembles a deck, then every player shuffles and decrypts
    var deck = AssembleDeck(hands, rng);
    // for (let i = 0; i < deck.length; i++) {
    //     console.log(i +":" + BytesToStr(PointToPlaintext(deck[i].C2)));
    // }

    for (const i of players.keys()) {
        deck = ShuffleAndDecrypt(deck,
            players[i].myPublishedKeys.Private,
            i == players.length-1 ? null: players[i+1].myPublishedKeys.Public,
            rng
        )
    }

//     for (const i of deck.keys()) {
//         console.log(BytesToStr(PointToPlaintext(deck[i].C2)));
//     }

    for (const i of players.keys()) {
        console.log("Player " + i + ": ");
        const card1 = "P" + i + CardNames.PlayerCards[0];
        const card2 = "P" + i + CardNames.PlayerCards[1];
        console.log(reference[FindPlayerCard(
            deck, players[i].myCards[0], card1
        )]);
        console.log(reference[FindPlayerCard(
            deck, players[i].myCards[1], card2
        )]);
   }

   console.log("Flop Cards:");
   for (const i of CardNames.FlopCards.keys()) {
        let privKeys = Array<Uint8Array>(players.length);
        for (const j of players.keys()) {
            privKeys[j] = players[j].flop[i];
        }
        console.log(reference[FindPoolCard(
            deck, 
            privKeys,
            pubKeys,
            CardNames.FlopCards[i]
        )]);
    }

    var privKeys = Array<Uint8Array>(players.length);
    for (const j of players.keys()) {
        privKeys[j] = players[j].river;
    }
    console.log("River: " + reference[FindPoolCard(
        deck, privKeys, pubKeys, CardNames.River
    )]);

    privKeys = Array<Uint8Array>(players.length);
    for (const j of players.keys()) {
        privKeys[j] = players[j].turn;
    }
    console.log("Turn: " + reference[FindPoolCard(
        deck, privKeys, pubKeys, CardNames.Turn
    )]);
  });
});
