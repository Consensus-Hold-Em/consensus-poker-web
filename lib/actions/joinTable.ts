import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "../keypair/getKeyPair"
import {
  PACKAGE_ADDRESS,
} from "../config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export interface SUIProps {
  suiClient: SuiClient;
  cardTableId: string;
  playerKey: string;
  playerSeedKey?: string;
}

export const joinTable = async ({
  suiClient,
  cardTableId,
  playerKey
}: SUIProps): Promise<string | undefined> => {
  console.log("Joining CardTable...");
  console.log({cardTableId,
    playerKey});
  const tx = new TransactionBlock();

  const buyInCoin = tx.splitCoins(tx.gas, [
    tx.pure(.15 * Number(MIST_PER_SUI)),
  ]);

  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::join_table`,
    arguments: [
      tx.object(cardTableId),
      buyInCoin,
    ],
  });

  tx.setGasBudget(100000000)
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
        return CardTableId;
      }
    })
    .catch((err) => {
      console.error("Error = ", err);
      return undefined;
    });
};
