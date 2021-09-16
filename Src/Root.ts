import NDBClient from "@/Client/Client";

async function start(): Promise<void> {
  const client = new NDBClient();
  client.start();
}

start().catch((error: Error) => {
  console.error(`Start Error: ${error.message}`);
})
