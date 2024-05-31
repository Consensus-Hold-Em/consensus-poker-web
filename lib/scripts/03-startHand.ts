import { SuiClient, SuiHTTPTransport } from "@mysten/sui.js/client";
import fs from "fs";
import { CARD_TABLE_ID, PLAYER1_SECRET_KEY, PLAYER2_SECRET_KEY, PLAYER3_SECRET_KEY, SUI_NETWORK } from "../config";
import { startHand } from "../actions/startHand";
import { WebSocket } from 'ws';


const runStartHand = async () => {
  const CardTableId = await startHand({
    suiClient: new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    cardTableId: CARD_TABLE_ID,
    playerKey: PLAYER3_SECRET_KEY
  });
};

runStartHand();
