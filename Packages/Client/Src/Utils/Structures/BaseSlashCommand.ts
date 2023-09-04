/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { SlashCommandOptions } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class BaseSlashCommand {
  constructor(
    private client: NDBClient,
    public options: SlashCommandOptions,
    public args: CommandInteractionOptionResolver
  ) {
    this.client = client;
    this.options = options;
    this.args = args;
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver,
    premium?: boolean
  ) {
    throw new Error(
      `Comando \`${this.options.data.name}\` Não proveu um método Run!`
    );
  }
}
