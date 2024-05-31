import { SuiClient } from "@mysten/sui.js/client";
import fs from "fs";
import { CARD_TABLE_ID, PLAYER1_SECRET_KEY, SUI_NETWORK } from "../config";
import { startHand } from "../actions/startHand";

const runStartHand = async () => {
  const CardTableId = await startHand({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER1_SECRET_KEY
  });
};

runStartHand();
