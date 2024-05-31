import { DeckReference, EncryptedCard } from "../../protocol/cards";
import { ed25519 } from "@noble/curves/ed25519";
import { getPlayerId } from "../getPlayerId";
import { getCardTableObject } from "../getObject/getCardTableObject";
import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { getKeypair } from "../keypair/getKeyPair";
import { PACKAGE_ADDRESS } from "../config";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { NewSeed, NewSeededRNG } from "../../protocol/random";
import { AssembleDeck, FindPlayerCard, FindPoolCard, GenPlayerKeys, ShuffleAndDecrypt } from "../../protocol/player";
import { parseHandStateJSON, readSuiBytes, readSuiString } from "./startHand";
import { ExtPointType } from "@noble/curves/abstract/edwards";


export type ShuffledDeck = {
    d: EncryptedCard[], 
    player_id: number
}

export function deckToJSON(deck: ShuffledDeck): string {
    let json = JSON.stringify(deck, 
        (key, value) => {
        if (key == "In" || key == "C1" || key == "C2") {
            return value.toHex();
        }
        return value;
    });
    return json;
}

export function parseDeckFromJSON(deckJSON: string): ShuffledDeck {
    let deck: ShuffledDeck = JSON.parse(deckJSON, (key, value) => {
        if (key == "In" || key == "C1" || key == "C2") {
            return ed25519.ExtendedPoint.fromHex(value);
        }
        return value;
    });
    return deck;
}

export interface SUIProps {
    suiClient: SuiClient;
    cardTableId: string;
    playerKey: string;
}

// startHand is called by each player, starting with player 0.
export const shuffleAndDecrypt= async ({
    suiClient,
    cardTableId,
    playerKey
}: SUIProps) => {
    const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
    const card_table = await getCardTableObject(suiClient, cardTableId);

    let seedb64 = process.env[`SEED${player_id}`] as string;
    let seed = new Uint8Array(Buffer.from(seedb64, 'base64'));
    console.log("SEED: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);

    let deck: ShuffledDeck = { 
        d: new Array<EncryptedCard>(52),
        player_id: player_id
    }
    if (player_id == 0) {
        console.log(card_table.hand_state)
        console.log(readSuiString(card_table.hand_state))
        let hands = parseHandStateJSON(readSuiString(card_table.hand_state));
        deck.d = AssembleDeck(hands, rng);
    } else {
        deck = parseDeckFromJSON(readSuiString(card_table.deck));
        deck.player_id = player_id;
    }

    let next_player_id = deck.player_id + 1;
    let next_player_key: ExtPointType | null = null;
    if (next_player_id < card_table.players.length) {
        next_player_key = ed25519.ExtendedPoint.fromHex(
            readSuiBytes(card_table.current_keys[next_player_id]));
    }

    deck.d = ShuffleAndDecrypt(deck.d, player_keys.myPublishedKeys.Private,
        next_player_key, rng);
            
    const tx = new TransactionBlock();

    console.log(player_id, card_table.players[player_id])
  
    tx.moveCall({
      target: `${PACKAGE_ADDRESS}::consensus_holdem::ShuffleAndDecrypt`,
      arguments: [
        tx.object(cardTableId),
        tx.pure(player_id),
        tx.pure(deckToJSON(deck))
      ],
    });
  
    // tx.setGasBudget(100000000)
  
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
        console.log(resp)
        const status = resp?.effects?.status.status;
        console.log("executed! status = ", status);
        if (status !== "success") {
          throw new Error("Join Table Error");
        }
        if (status === "success") {
          const createdObjects = resp.objectChanges?.filter(
            ({ type }) => type === "mutated"
          ) as SuiObjectChangeCreated[];
          const createdCardTable = createdObjects.find(({ objectType }) =>
            objectType.endsWith("consensus_holdem::CardTable")
          );
          if (!createdCardTable) {
            throw new Error("Shuffle and decrypt not created");
          }
          const { objectId: CardTableId } = createdCardTable;
          console.log({ CardTableId });
          return CardTableId;
        }
      })
      .catch((err) => {
        console.error("Error = ", err);
        return undefined;
      });
};
function SeededRNG(arg0: Uint8Array) {
    throw new Error("Function not implemented.");
}

