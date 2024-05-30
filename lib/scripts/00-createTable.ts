import { SuiClient } from "@mysten/sui.js/client";
import { createTable } from "../actions/createTable";
import fs from "fs";
import { SUI_NETWORK } from "../config";

const initCreateTable = async () => {
  const CardTableId = await createTable({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
  });
  fs.appendFileSync("./.env", `CARD_TABLE_ID=${CardTableId}\n`);
  fs.appendFileSync(
    "./app/.env",
    `NEXT_PUBLIC_CARD_TABLE_ID=${CardTableId}\n`
  );
};

initCreateTable();
