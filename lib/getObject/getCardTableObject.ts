import { SuiClient, SuiMoveObject } from "@mysten/sui.js/client";
import { CardTable } from "../../types/CardTable";

interface GetGameObjectProps {
  suiClient: SuiClient;
  cardTableId: string;
}

export const getCardTableObject = async (suiClient: SuiClient,
  cardTableId: string): Promise<CardTable> => {
  const res = await suiClient.getObject({
    id: cardTableId,
    options: { showContent: true },
  });
  const gameObject = res?.data?.content as SuiMoveObject;
  const { fields } = gameObject;
  return fields as unknown as CardTable;
};
