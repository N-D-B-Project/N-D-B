import NDBClient from "@/Client/NDBClient"
import {
  CommandHandler,
  EventHandler,
  SlashHandler,
  SubCommandHandler
} from "."

export default class LoadHandlers {
  public constructor(public client: NDBClient) {
    this.client = client
  }

  async Load() {
    const _EventHandler: EventHandler = new EventHandler(this.client)
    const _CommandHandler: CommandHandler = new CommandHandler(this.client)
    const _SlashHandler: SlashHandler = new SlashHandler(this.client)
    const _SubCommandHandler: SubCommandHandler = new SubCommandHandler(
      this.client
    )
    await _CommandHandler.load()
    await _EventHandler.load()
    await _SubCommandHandler.load()
    this.client.once("ready", async () => {
      await _SlashHandler.load()
    })
  }
}
