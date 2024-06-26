import { SuiClient, SuiEvent, SuiObjectChangeCreated, Unsubscribe, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "../keypair/getKeyPair"
import {GenPlayerKeys, StartHand, type InitialHandState} from "../../protocol/player";
import { keccak_256 } from "@noble/hashes/sha3";
import {
  PACKAGE_ADDRESS,
} from "../../lib/config";
import { SUIProps } from "./joinTable";
import { getCardTableObject } from "../getObject/getCardTableObject";
import { NewSeed, NewSeededRNG } from "../../protocol/random";
import { ExtPointType } from "@noble/curves/abstract/edwards";
import { ed25519 } from "@noble/curves/ed25519";
import { getPlayerId } from "../getPlayerId";
import { EncryptedCard } from "@/protocol/cards";

export interface StartHandProps {
    suiClient: SuiClient;
}

export function readSuiString(element: number[]): string {
  return element.map(x => String.fromCharCode(x)).join('');
}

export function readSuiBytes(element: number[]): Uint8Array {
  const hexStr = readSuiString(element);
  return Uint8Array.from(Buffer.from(hexStr, 'hex'));
}

export function handStateToJSON(hand: InitialHandState): string {
  let json = JSON.stringify(hand, (key, value) => {
    if (key == "In" || key == "C1" || key == "C2") {
      return value.toHex();
    }
    return value;
  });
  return json;
}

export function parseHandStateJSON(handJSON: string): InitialHandState {
  let hand: InitialHandState = JSON.parse(handJSON, (key, value) => {
    if (key == "In" || key == "C1" || key == "C2") {
      return ed25519.ExtendedPoint.fromHex(value);
    }
    return value;
  });
  return hand;
}

// startHand is called by each player, starting with player 0.
export const startHand = async ({
    suiClient,
    cardTableId,
    playerKey,
    playerSeedKey,
}: SUIProps) => {
  // Get public key from playerKey
  const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
  const card_table = await getCardTableObject(suiClient, cardTableId);
  console.log("player_id", player_id);
  console.log("card_table", card_table);
  let public_keys = new Array<ExtPointType>(card_table.current_keys.length);
  for (const i of card_table.current_keys.keys()) {
    console.log(card_table.current_keys[i]);
    const hexStr = card_table.current_keys[i].map(x => String.fromCharCode(x)).join('');
    const keyBytes = Uint8Array.from(Buffer.from(hexStr, 'hex'));
    console.log(keyBytes);
    public_keys[i] = ed25519.ExtendedPoint.fromHex(keyBytes);
  }
  
  const submitStartHand = (prev_hand: InitialHandState | null, unsubscribe: Unsubscribe | null) => {
    // parse SuiEvent into HandState
    // let prev_hand: InitialHandState | null = null;
    // if (prev_hand_event && player_id != 0) {
    //   const prev_hand_json = prev_hand_event!.parsedJson as any
    //   console.log(prev_hand_json);
    //   const prev_player_id = prev_hand_json["player_id"] as number;
    //   const prev_hand = prev_hand_json['hand_state'] as InitialHandState;
    //   console.log(prev_hand);

    //   if (prev_player_id != (player_id - 1) ) {
    //     console.log(`StartHand: ignoring prev_player: ${prev_player_id} for ${player_id}`);
    //     return;
    //   }
    // }
    // Read seed, then create commitment
    let seedb64 = playerSeedKey as string;
    let seed = new Uint8Array(Buffer.from(seedb64, 'base64'));
    console.log("SEED: " + seed);
    let commitment = keccak_256("Seed: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);

    
    // call the init hand state, logic on this differs based on player id
    let hand = StartHand(player_id,
      player_keys,
      prev_hand,
      public_keys,
      rng
    );

    // console.log('d', public_keys[player_id])
    // console.log(public_keys[player_id].toRawBytes())
    let handJSON = handStateToJSON(hand);
    console.log(handJSON)

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::start_hand`,
      arguments: [
        tx.object(cardTableId),
        tx.pure(player_id),
        tx.pure(Buffer.from(commitment).toString('hex')),
        tx.pure(handJSON),
      ],
    });

    tx.setGasBudget(100000000)

    suiClient
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
        console.log(resp)
        const status = resp?.effects?.status.status;
        console.log("executed! status = ", status);
        if (status !== "success") {
          throw new Error("Start hand not created");
        }
        if (status === "success") {
          const createdObjects = resp.objectChanges?.filter(
            ({ type }) => type === "mutated"
          ) as SuiObjectChangeCreated[];
          const createdCardTable = createdObjects.find(({ objectType }) =>
            objectType.endsWith("consensus_holdem::CardTable")
          );
          if (!createdCardTable) {
            throw new Error("CardTable not created");
          }
          const { objectId: CardTableId } = createdCardTable;
          return {seed};
        }
      })
      .catch((err) => {
        console.error("Error = ", err);
        return undefined;
      });

      if (unsubscribe) unsubscribe();
  }


  // If we are not player 0, we need to set up a listener to wait for the 
  // playerid-1 starthandevent object.
  console.log(player_id)
  if (player_id != 0) {
    var prev_hand: InitialHandState | null = null;
    while(prev_hand == null) {
      const card_table = await getCardTableObject(suiClient, cardTableId);
      let hand_state_str = readSuiString(card_table.hand_state);
      console.log(hand_state_str);
      prev_hand = parseHandStateJSON(hand_state_str)
      console.log(prev_hand);
      const prev_player_id = prev_hand.PlayerID as number;

      if (prev_player_id == (player_id-1)) {
        submitStartHand(prev_hand, null);
      } else {
        console.log(`StartHand: ignoring prev_player: ${prev_player_id} for ${player_id}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1_000))

    }

    // Note: doesn't work
    // let unsubscribe = await suiClient.subscribeEvent({
    //   filter: { MoveEventType: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::StartHandEvent` },
    //   // filter: { Package: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}` },
    //   onMessage: (event) => {
    //     console.log('StartHandEvent', JSON.stringify(event, null, 2));
    //     submitStartHand(event, unsubscribe);
    //   },
    // });
  } else {
    submitStartHand(null, null);
  }

};