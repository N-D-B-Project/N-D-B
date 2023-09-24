import "dotenv/config";

import NDBClient from "@/Core/NDBClient";
import { INDBClient } from "./Types";

async function start(): Promise<void> {
  const client = new NDBClient() as INDBClient;
  await client.Start();
}

start().catch((error: Error) => {
  console.error(`Start Error: ${error.stack}`);
});
