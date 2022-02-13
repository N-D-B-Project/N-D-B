import { CommandOptions } from "~/Types";
import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";

export default class BaseCommand {
  constructor(
    private client: NDBClient,
    public name: string,
    public options: CommandOptions,
    public args: Array<string> | Discord.CommandInteractionOptionResolver
  ) {
    this.name = name;
    this.client = client;
    this.options = options;
    this.args = args;
  }

  async run(client: NDBClient, message: Discord.Message, args: Array<string>) {
    throw new Error(`Comando \`${this.name}\` Não proveu um método Run!`);
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args: Discord.CommandInteractionOptionResolver
  ) {
    throw new Error(`Comando \`${this.name}\` Não proveu um método Run!`);
  }
}
