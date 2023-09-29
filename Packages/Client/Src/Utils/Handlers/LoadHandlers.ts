/* eslint-disable @typescript-eslint/no-unused-vars */
import { INDBClient } from "@/Types";
import {
  CommandHandler,
  EventHandler,
  SlashHandler,
  SubHandler
} from "./index";

export default class LoadHandlers {
  // eslint-disable-next-line no-empty-function
  public constructor(public client: INDBClient) {}

  async load() {
    await new EventHandler(this.client).load();
    await new CommandHandler(this.client).load();
    const _SlashHandler = new SlashHandler(this.client);
    await new SubHandler(this.client).load();
    this.client.once("ready", async () => {
      await _SlashHandler.load();
    });
  }
}
