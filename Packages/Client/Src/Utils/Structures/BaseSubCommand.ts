/* eslint-disable @typescript-eslint/no-unused-vars */
import { INDBClient, SubCommandOptions } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class BaseSubCommand {
  constructor(
    private client: INDBClient,
    public options: SubCommandOptions,
    public args: CommandInteractionOptionResolver
  ) {
    this.client = client;
    this.options = options;
    this.args = args;
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    premium?: boolean
  ) {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    );
  }
}
