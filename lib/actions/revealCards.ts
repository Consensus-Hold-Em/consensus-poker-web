import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair, getKeyPairFromMnemonic } from "../keypair/getKeyPair"
import {
  PACKAGE_ADDRESS,
  PLAYER1_SECRET_KEY,
} from "../config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { ed25519 } from "@noble/curves/ed25519";
import { getCardTableObject } from "../getObject/getCardTableObject";
import { keccak_256 } from "@noble/hashes/sha3";
import { NewSeededRNG } from "../../protocol/random";
import { FindPlayerCard, FindPoolCard, GenPlayerKeys } from "../../protocol/player";
import { getPlayerId } from "../getPlayerId";
import { readSuiBytes, readSuiString } from "./startHand";
import { parseDeckFromJSON } from "./shuffleAndDecrypt";
import { DeckReference } from "@/protocol/cards";
import { ExtPointType } from "@noble/curves/abstract/edwards";

export interface SUIProps {
  suiClient: SuiClient;
}

export type Reveal = {
    player_id: number,
    keys: Uint8Array[][]
}

export function revealToJSON(secrets: Reveal): string {
    let json = JSON.stringify(secrets, 
        (key, value) => {
        if (key == "In" || key == "C1" || key == "C2") {
            return value.toHex();
        }
        return value;
    });
    return json;
}

export function parseRevealFromJSON(revealJSON: string) {
    let deck: Reveal = JSON.parse(revealJSON, (key, value) => {
        if (key == "In" || key == "C1" || key == "C2") {
            return ed25519.ExtendedPoint.fromHex(value);
        }
        return value;
    });
    return deck;
}


export const revealFlop = async (
  {
  suiClient,
  cardTableId,
  playerKey,
  playerSeedKey,
}) => {
  const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
  const card_table = await getCardTableObject(suiClient, cardTableId);
  console.log("Revealing Flop...");
  const tx = new TransactionBlock();

    // Read seed, then create commitment
    let seed = new Uint8Array(Buffer.from(playerSeedKey, 'base64'));
    console.log("SEED: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);

    let flop_secrets = player_keys.flop;

    let mySecrets = {
        player_id: player_id,
        keys: new Array<Array<Uint8Array>>(player_id+1),
    }

    if (player_id != 0) {
        let curState = parseRevealFromJSON(readSuiString(card_table.flop));
        console.log("curState", curState);
        for (const i of curState.keys.keys()) {
            mySecrets.keys[i] = curState.keys[i];
        }
    }
    mySecrets.keys[player_id] = flop_secrets;



  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::reveal_flop`,
    arguments: [
      tx.object(cardTableId),
      tx.pure(revealToJSON(mySecrets))
    ],
  });

  return suiClient
    .signAndExecuteTransactionBlock({
      signer: getKeypair(playerKey!),
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    })
    .then((resp) => {
      const status = resp?.effects?.status.status;
      console.log("executed! status = ", status);
      if (status !== "success") {
        throw new Error("Reveal Flop not created");
      }
      return
    })
    .catch((err) => {
      console.error("Error = ", err);
      return undefined;
    });
};

export const revealTurn = async (
    suiClient: SuiClient,
    cardTableId: string,
    playerKey: string
  ) => {
    const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
    const card_table = await getCardTableObject(suiClient, cardTableId);
    console.log("Revealing Turn...");
    const tx = new TransactionBlock();

    // Read seed, then create commitment
    let seedb64 = process.env[`SEED${player_id}`] as string;
    let seed = new Uint8Array(Buffer.from(seedb64, 'base64'));
    console.log("SEED: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);

    let turn_secrets = [player_keys.turn];

    let mySecrets = {
        player_id: player_id,
        keys: new Array<Array<Uint8Array>>(player_id+1),
    }

    if (player_id != 0) {
        let curState = parseRevealFromJSON(readSuiString(card_table.turn));
        for (const i of curState.keys.keys()) {
            mySecrets.keys[i] = curState.keys[i];
        }
    }
    mySecrets.keys[player_id] = turn_secrets;
    

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::reveal_turn`,
      arguments: [
        tx.object(cardTableId),
        tx.pure(revealToJSON(mySecrets))
      ],
    });
  
    return suiClient
      .signAndExecuteTransactionBlock({
        signer: getKeypair(PLAYER1_SECRET_KEY!),
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      })
      .then((resp) => {
        const status = resp?.effects?.status.status;
        console.log("executed! status = ", status);
        if (status !== "success") {
          throw new Error("Reveal Turn not created");
        }
        return
      })
      .catch((err) => {
        console.error("Error = ", err);
        return undefined;
      });
};

export const revealRiver = async (
    suiClient: SuiClient,
    cardTableId: string,
    playerKey: string,
  ) => {
    const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
    const card_table = await getCardTableObject(suiClient, cardTableId);
    console.log("Revealing River...");
    const tx = new TransactionBlock();

        // Read seed, then create commitment
        let seedb64 = process.env[`SEED${player_id}`] as string;
        let seed = new Uint8Array(Buffer.from(seedb64, 'base64'));
        console.log("SEED: " + seed);
        let rng = NewSeededRNG(seed);
        let player_keys = GenPlayerKeys(rng);
    
        let river_secrets = [player_keys.river];
    
        let mySecrets = {
            player_id: player_id,
            keys: new Array<Array<Uint8Array>>(player_id+1),
        }
    
        if (player_id != 0) {
            let curState = parseRevealFromJSON(readSuiString(card_table.river));
            for (const i of curState.keys.keys()) {
                mySecrets.keys[i] = curState.keys[i];
            }
        }
        mySecrets.keys[player_id] = river_secrets;
    
  
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::reveal_river`,
      arguments: [
        tx.object(cardTableId),
        tx.pure(revealToJSON(mySecrets))
      ],
    });
  
    return suiClient
      .signAndExecuteTransactionBlock({
        signer: getKeypair(PLAYER1_SECRET_KEY!),
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      })
      .then((resp) => {
        const status = resp?.effects?.status.status;
        console.log("executed! status = ", status);
        if (status !== "success") {
          throw new Error("Reveal River not created");
        }
        return
      })
      .catch((err) => {
        console.error("Error = ", err);
        return undefined;
      });
  };


export const showFlop = async ({
    suiClient,
    cardTableId,
}) => {
    const card_table = await getCardTableObject(suiClient, cardTableId);

    let flop = parseRevealFromJSON(readSuiString(card_table.flop));
    let deck = parseDeckFromJSON(readSuiString(card_table.deck));

    
    let pubKeys = new Array<ExtPointType>(card_table.current_keys.length);
    for (const i of card_table.current_keys.keys()) {
      console.log(card_table.current_keys[i]);
      const hexStr = card_table.current_keys[i].map(x => String.fromCharCode(x)).join('');
      const keyBytes = Uint8Array.from(Buffer.from(hexStr, 'hex'));
      console.log("keyBytes", keyBytes);
      pubKeys[i] = ed25519.ExtendedPoint.fromHex(keyBytes);
    }

    console.log("PUBKEYS: ", pubKeys)

    let reference = DeckReference();

    console.log("Flop Cards: ");

    for (let i = 0; i < 3; i++) {
      let flop_secrets = new Array<Uint8Array>();
      for (const pid of flop.keys.keys()) {
        flop_secrets.push(flop.keys[pid][i]);
      }
      console.log("flop_secrets", flop_secrets);
      let idx = FindPoolCard(deck.d, flop_secrets, pubKeys, `Flop${i}`);
      console.log(reference[idx]);
      return reference[idx];
    }
}  

export const showRiver = async (
  suiClient: SuiClient,
  cardTableId: string,
) => {
  const card_table = await getCardTableObject(suiClient, cardTableId);

  let river = parseRevealFromJSON(readSuiString(card_table.river));
  let deck = parseDeckFromJSON(readSuiString(card_table.deck));
  let pubkeys = card_table.current_keys.map(
    x => ed25519.ExtendedPoint.fromHex(readSuiBytes(x)));

  let reference = DeckReference();

  console.log("River Card: ");

  let river_secrets = new Array<Uint8Array>();
  for (const pid of river.keys.keys()) {
    river_secrets.push(river.keys[pid][0]);
  }
  let idx = FindPoolCard(deck.d, river_secrets, pubkeys, "River");
  console.log(reference[idx]);
}

export const showTurn = async (
  suiClient: SuiClient,
  cardTableId: string,
) => {
  const card_table = await getCardTableObject(suiClient, cardTableId);

  let turn = parseRevealFromJSON(readSuiString(card_table.turn));
  let deck = parseDeckFromJSON(readSuiString(card_table.deck));
  let pubkeys = card_table.current_keys.map(
    x => ed25519.ExtendedPoint.fromHex(readSuiBytes(x)));

  let reference = DeckReference();

  console.log("Turn Card: ");

  let turn_secrets = new Array<Uint8Array>();
  for (const pid of turn.keys.keys()) {
    turn_secrets.push(turn.keys[pid][0]);
  }
  let idx = FindPoolCard(deck.d, turn_secrets, pubkeys, "Turn");
  console.log(reference[idx]);
}  


export const showCards = async ({
  suiClient,
  cardTableId,
  playerKey,
  playerSeedKey,
}) => {
  console.log({
    suiClient,
    cardTableId,

    playerKey,
    playerSeedKey,
  })
  const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
  const card_table = await getCardTableObject(suiClient, cardTableId);

  let seed = new Uint8Array(Buffer.from(playerSeedKey, 'base64'));
  console.log("SEED: " + seed);
  let rng = NewSeededRNG(seed);
  let player_keys = GenPlayerKeys(rng);

  let deck = parseDeckFromJSON(readSuiString(card_table.deck));
  let pubkeys = card_table.current_keys.map(
    x => ed25519.ExtendedPoint.fromHex(readSuiBytes(x)));

  let reference = DeckReference();

  console.log(`Player ${player_id} Cards`)

  let idx1 = FindPlayerCard(deck.d, player_keys.myCards[0], `P${player_id}Card1`);
  let idx2 = FindPlayerCard(deck.d, player_keys.myCards[1], `P${player_id}Card2`);
  return {
    card1: reference[idx1],
    card2: reference[idx2]
  }
}