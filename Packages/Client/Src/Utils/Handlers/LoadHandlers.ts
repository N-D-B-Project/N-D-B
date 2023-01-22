import NDBClient from "@/Client/NDBClient"
import { CommandHandler, EventHandler, SlashHandler, SubHandler } from "./index"

export default class LoadHandlers {
  public constructor(public client: NDBClient) {
    this.client = client
  }

  async Load() {
    const _EventHandler = await new EventHandler(this.client).load()
    const _CommandHandler = await new CommandHandler(this.client).load()
    const _SlashHandler = new SlashHandler(this.client)
    const _SubHandler = await new SubHandler(this.client).load()
    this.client.once("ready", async () => {
      await _SlashHandler.load()
    })
  }
}
