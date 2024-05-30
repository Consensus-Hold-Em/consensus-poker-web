import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair, getKeyPairFromMnemonic } from "../keypair/getKeyPair"
import {
  PACKAGE_ADDRESS,
  PLAYER1_SECRET_KEY,
} from "../config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export interface SUIProps {
  suiClient: SuiClient;
}

export const createTable = async ({
  suiClient,
}: SUIProps): Promise<string | undefined> => {
  console.log("Creating CardTable...");
  const tx = new TransactionBlock();

  const initialCoin = tx.splitCoins(tx.gas, [
    tx.pure(.01 * Number(MIST_PER_SUI)),
  ]);

  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::consensus_holdem::create_table`,
    arguments: [
      initialCoin,
      tx.pure(25),
      tx.pure(0),
      tx.pure(1),
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
      console.log(resp)
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
