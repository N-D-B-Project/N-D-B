/* eslint-disable @typescript-eslint/no-unused-vars */
import { INDBClient } from "@/Types";
import { CommandHandler, EventHandler } from "./index";

export default class LoadHandlers {
  // eslint-disable-next-line no-empty-function
  public constructor(public client: INDBClient) {}

  async load() {
    await new EventHandler(this.client).load();
    const _CommandHandler = new CommandHandler(this.client);
    this.client.once("ready", async () => {
      await _CommandHandler.load();
    });
  }
}
