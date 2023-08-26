/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import {
  CommandHandler,
  EventHandler,
  SlashHandler,
  SubHandler
} from "./index";

export default class LoadHandlers {
  public constructor(public client: NDBClient) {
    this.client = client;
  }

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
