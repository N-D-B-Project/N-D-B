/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INDBClient, SubCommandOptions } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class BaseSubCommand {
  public constructor(
    protected client: INDBClient,
    public options: SubCommandOptions,
    public args: CommandInteractionOptionResolver
  ) {}

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    premium?: boolean
  ): Promise<void> {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    );
  }
}
