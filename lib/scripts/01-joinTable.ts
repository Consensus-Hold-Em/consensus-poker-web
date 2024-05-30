import { SuiClient } from "@mysten/sui.js/client";
import { joinTable } from "../actions/joinTable";
import { SUI_NETWORK, CARD_TABLE_ID, PLAYER2_SECRET_KEY } from "../config";

const initJoinTable = async () => {
  await joinTable({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER2_SECRET_KEY
  });
};

initJoinTable();
