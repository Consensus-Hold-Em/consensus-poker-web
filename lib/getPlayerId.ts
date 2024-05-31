import { SuiClient } from "@mysten/sui.js/client";
import { getCardTableObject } from "./getObject/getCardTableObject";
import { getKeypair } from "./keypair/getKeyPair";

export const getPlayerId = async (suiClient: SuiClient, cardTableId: string, playerSecretKey: string) => {
    const player_pubkey = getKeypair(playerSecretKey).getPublicKey().toSuiAddress() // .toBase64();
    // Query the card_table structure and figure out what player ID we are.
    const card_table = await getCardTableObject(suiClient, cardTableId);
    const player_id = card_table.players.map(x => x.toString()).findIndex(x => x == player_pubkey);
    return player_id
}