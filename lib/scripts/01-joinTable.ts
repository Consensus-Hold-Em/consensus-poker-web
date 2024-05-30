import { SuiClient } from "@mysten/sui.js/client";
import { joinTable } from "../actions/joinTable";
import { SUI_NETWORK, CARD_TABLE_ID } from "../config";

const initJoinTable = async () => {
  await joinTable({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID
  });
};

initJoinTable();
