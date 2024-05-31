import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "../keypair/getKeyPair"
import {
  PACKAGE_ADDRESS,
} from "../config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { getCardTableObject } from "../getObject/getCardTableObject";
import { GenPlayerKeys } from "../../protocol/player";
import { NewSeed, NewSeededRNG } from "../../protocol/random";
import { keccak_256 } from "@noble/hashes/sha3";
import { getPlayerId } from "../getPlayerId";

export interface SUIProps {
  suiClient: SuiClient;
  cardTableId: string;
  playerKey: string;
}

export const newHand = async ({
    suiClient,
    cardTableId,
    playerKey
  }: SUIProps): Promise<string | undefined> => {

    // Generate seed, then create commitment
    const seed = NewSeed();
    const commitment = keccak_256("Seed: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);
    
    // TODO new function get player id
    const player_id = await getPlayerId(suiClient, cardTableId, playerKey);
    const card_table = await getCardTableObject(suiClient, cardTableId);

    // TODO: store seed in file here
    // fs.appendFileSync("./.env", `SEED${player_id}=${Buffer.from(seed).toString('base64')}\n`);

    const tx = new TransactionBlock();

    console.log(player_id, card_table.players[player_id])
  
    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::new_hand`,
      arguments: [
        tx.object(cardTableId),
        tx.pure(player_id),
        tx.pure(player_keys.myPublishedKeys.Public.toHex())
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
            throw new Error("CardTable not created");
          }
          const { objectId: CardTableId } = createdCardTable;
          console.log({ CardTableId });

          // returns the seed
          return Buffer.from(seed).toString('base64');
        }
      })
      .catch((err) => {
        console.error("Error = ", err);
        return undefined;
      });
  };
  

    // Generate seed, then create commitment
    let seed = NewSeed();
    let commitment = keccak_256("Seed: " + seed);
    let rng = NewSeededRNG(seed);
    let player_keys = GenPlayerKeys(rng);
