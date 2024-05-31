import { SuiClient, SuiHTTPTransport } from "@mysten/sui.js/client";import fs from "fs";
import { CARD_TABLE_ID, PLAYER1_SECRET_KEY, PLAYER2_SECRET_KEY, PLAYER3_SECRET_KEY, SUI_NETWORK } from "../config";
import { WebSocket } from 'ws';
import { revealFlop, revealRiver, revealTurn, showFlop, showRiver, showTurn } from "../actions/revealCards";

const waitTime = 4_000

const revealCards = async () => {
  await revealFlop(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER1_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealFlop(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER2_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealFlop(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER3_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))

  await revealTurn(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER1_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealTurn(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER2_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealTurn(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER3_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))

  await revealRiver(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER1_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealRiver(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER2_SECRET_KEY
  );
  await new Promise(resolve => setTimeout(resolve, waitTime))
  await revealRiver(
    new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID,
    PLAYER3_SECRET_KEY
  );

  await showFlop(new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID)
  await showTurn(new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID)
  await showRiver(new SuiClient({ transport: new SuiHTTPTransport({ url: SUI_NETWORK, WebSocketConstructor: WebSocket as never,  }) }),
    CARD_TABLE_ID)
};

revealCards();
