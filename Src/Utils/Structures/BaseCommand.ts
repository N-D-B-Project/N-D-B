import Tools from "@Tools/Tools";
import { CommandOptions } from "@Types/Options";
import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";

export default class BaseCommand {
  client: NDBClient;
  name: string;
  aliases: Array<string>;
  options: CommandOptions;
  args: any;
  slashCommand: boolean;

  constructor(
    client: NDBClient,
    name: string,
    options: CommandOptions,
    args: any
  ) {
    this.name = options.name || name;
    this.client = client;
    this.name = options.name || name;
    this.options = options;
    this.args = args;
  }

  async run(
    client: NDBClient,
    message: any,
    args: any,
    tools: Tools,
    player: any
  ) {
    throw new Error(`Comando \`${this.name}\` Não proveu um método Run!`);
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args?: Array<any>,
    tools?: Tools
  ) {
    const error: any = `Comando \`${this.name}\` Não proveu um método Run!`;
    return error;
  }
}
