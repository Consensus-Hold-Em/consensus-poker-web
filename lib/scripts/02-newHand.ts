import { SuiClient } from "@mysten/sui.js/client";
import fs from "fs";
import { CARD_TABLE_ID, PLAYER1_SECRET_KEY, PLAYER2_SECRET_KEY, PLAYER3_SECRET_KEY, SUI_NETWORK } from "../config";
import { newHand } from "../actions/newHand";


const runNewHand = async () => {
  await newHand({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER1_SECRET_KEY
  });

  await newHand({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER2_SECRET_KEY
  });

  await newHand({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER3_SECRET_KEY
  });
};

runNewHand();
