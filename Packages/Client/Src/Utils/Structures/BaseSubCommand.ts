import { SubCommandOptions } from "~/Types";
import NDBClient from "@Client/NDBClient";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

export default class BaseSubCommand {
  constructor(
    private client: NDBClient,
    public options: SubCommandOptions,
    public args: CommandInteractionOptionResolver
  ) {
    this.client = client;
    this.options = options;
    this.args = args;
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    );
  }
}
