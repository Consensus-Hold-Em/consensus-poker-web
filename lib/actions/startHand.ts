import { SuiClient, SuiObjectChangeCreated, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "@/lib/keypair/getKeyPair"
import { getBLSPublicKey } from "@/lib/bls/getBLSPublicKey";
import type {InitialHandState} from "@/protocol/player";

import {
  PACKAGE_ADDRESS,
  Player1_SECRET_KEY,
} from "@/lib/config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export interface StartHandProps {
    suiClient: SuiClient;
    player_id: Number,
    public_key: Uint8Array,
    commitment: Uint8Array, 
    prev_hand_state: InitialHandState | null
}
  
// startHand is called by each player, starting with player 0.
export const startHand = async ({
    suiClient,
  }: StartHandProps): Promise<string | undefined> => {
    console.log("Creating CardTable...");
    const tx = new TransactionBlock();
  
    const houseCoin = tx.splitCoins(tx.gas, [
      tx.pure(10 * Number(MIST_PER_SUI)),
    ]);
    let adminBLSPublicKey = getBLSPublicKey(Player1_SECRET_KEY!);
  
    tx.moveCall({
      target: `${PACKAGE_ADDRESS}::consensus_holdem::create_table`,
      arguments: [
        tx.object(HOUSE_ADMIN_CAP),
        houseCoin,
        tx.pure(Array.from(adminBLSPublicKey)),
      ],
    });
  
    return suiClient
      .signAndExecuteTransactionBlock({
        signer: getKeypair(Player1_SECRET_KEY!),
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
          throw new Error("HouseData not created");
        }
        if (status === "success") {
          const createdObjects = resp.objectChanges?.filter(
            ({ type }) => type === "created"
          ) as SuiObjectChangeCreated[];
          const createdCardTable = createdObjects.find(({ objectType }) =>
            objectType.endsWith("consensus_holdem::CardTable")
          );
          if (!createdCardTable) {
            throw new Error("CardTable not created");
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
  

// Package is on Testnet.
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const Package = '<PACKAGE_ID>';

const MoveEventType = '<PACKAGE_ID>::<MODULE_NAME>::<METHOD_NAME>';

console.log(
	await client.getObject({
		id: Package,
		options: { showPreviousTransaction: true },
	}),
);

let unsubscribe = await client.subscribeEvent({
	filter: { Package },
	onMessage: (event) => {
		console.log('subscribeEvent', JSON.stringify(event, null, 2));
	},
});

process.on('SIGINT', async () => {
	console.log('Interrupted...');
	if (unsubscribe) {
		await unsubscribe();
		unsubscribe = undefined;
	}
});