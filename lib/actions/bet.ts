import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "@/lib/keypair/getKeyPair"
import {
  PACKAGE_ADDRESS,
  Player1_SECRET_KEY,
} from "@/lib/config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export interface SUIProps {
  suiClient: SuiClient;
}

export const bet = async ({
  suiClient,
}: SUIProps): Promise<string | undefined> => {
  console.log("Joining CardTable...");
  const tx = new TransactionBlock();

  const buyInCoin = tx.splitCoins(tx.gas, [
    tx.pure(10 * Number(MIST_PER_SUI)),
  ]);

  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::consensus_holdem::create_table`,
    arguments: [
      buyInCoin,
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
