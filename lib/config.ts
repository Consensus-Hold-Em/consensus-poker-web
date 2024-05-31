import { config } from "dotenv";

config({});
export const SUI_NETWORK = process.env.SUI_NETWORK!;
// export const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS!;
export const PLAYER1_SECRET_KEY = process.env.PLAYER1_SECRET_KEY!;
export const PLAYER2_SECRET_KEY = process.env.PLAYER2_SECRET_KEY!;
export const PLAYER3_SECRET_KEY = process.env.PLAYER3_SECRET_KEY!;
// export const BJ_PLAYER_SECRET_KEY = process.env.BJ_PLAYER_SECRET_KEY!;
// export const BJ_PLAYER_2_SECRET_KEY = process.env.BJ_PLAYER_2_SECRET_KEY!;
export const PACKAGE_ADDRESS = process.env.PACKAGE_ADDRESS!;

// export const HOUSE_ADMIN_CAP = process.env.HOUSE_ADMIN_CAP!;

export const CARD_TABLE_ID = process.env.CARD_TABLE_ID!;

export const SEED0 = process.env.SEED0!;
export const SEED1 = process.env.SEED1!;
export const SEED2 = process.env.SEED2!;
// export const GAME_ID = process.env.GAME_ID!;

// console.log everything in the process.env object
// const keys = Object.keys(process.env);
// console.log("env contains ADMIN_ADDRESS:", keys.includes("ADMIN_ADDRESS"));
// console.log(
//   "env contains ADMIN_SECRET_KEY:",
//   keys.includes("ADMIN_SECRET_KEY")
// );
