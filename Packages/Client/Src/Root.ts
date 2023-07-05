import "dotenv/config"

import NDBClient from "@/Client/NDBClient"

async function start(): Promise<void> {
  const client = new NDBClient()
  await client.Start()
}

start().catch((error: Error) => {
  console.error(`Start Error: ${error.stack}`)
})
