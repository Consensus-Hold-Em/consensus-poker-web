import { SuiClient, SuiHTTPTransport } from "@mysten/sui.js/client";
import fs from "fs";
import { CARD_TABLE_ID, PLAYER1_SECRET_KEY, PLAYER2_SECRET_KEY, PLAYER3_SECRET_KEY, SUI_NETWORK } from "../config";
import { WebSocket } from 'ws';
import { shuffleAndDecrypt } from "../actions/shuffleAndDecrypt";


const runShuffleAndDecrypt = async () => {
  await shuffleAndDecrypt({
    suiClient: new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER3_SECRET_KEY
  });
};

runShuffleAndDecrypt();
