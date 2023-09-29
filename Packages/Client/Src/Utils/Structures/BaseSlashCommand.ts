/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INDBClient, SlashCommandOptions } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class BaseSlashCommand {
  public constructor(
    protected client: INDBClient,
    public options: SlashCommandOptions,
    public args: CommandInteractionOptionResolver
  ) {}

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    premium?: boolean
  ): Promise<void> {
    throw new Error(
      `Comando \`${this.options.data.name}\` Não proveu um método Run!`
    );
  }
}
