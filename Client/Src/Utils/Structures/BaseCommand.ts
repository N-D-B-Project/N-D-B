import { CommandOptions } from "~/Types";
import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";
import { InteractionTools, MessageTools } from "../Tools";

export default class BaseCommand {
  public name: string;
  constructor(
    private client: NDBClient,
    public options: CommandOptions,
    public args: Array<string> | Discord.CommandInteractionOptionResolver
  ) {
    this.name = options.name;
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
