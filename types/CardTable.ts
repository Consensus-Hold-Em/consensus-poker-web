import type { EncryptedCard } from "@/protocol/cards";

export interface CardTable {
    id: {
        id: string;
    },
    buy_in: number;
    small_blind: number;
    big_blind: number;
    players: Uint8Array[],
    chips: Record<string, number>,
    current_pot: number;
    current_keys: number[][];
    round: number;
    turn: number;
    deck: EncryptedCard[];
    hand_state: number[];
}
