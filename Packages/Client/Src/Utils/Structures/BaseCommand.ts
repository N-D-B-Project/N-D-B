import NDBClient from "@/Client/NDBClient"
import { CommandOptions } from "@n-d-b/types"
import { Message } from "discord.js"

export default class BaseCommand {
  constructor(
    private client: NDBClient,
    public options: CommandOptions,
    public args: Array<string>
  ) {
    this.client = client
    this.options = options
    this.args = args
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    )
  }
}
