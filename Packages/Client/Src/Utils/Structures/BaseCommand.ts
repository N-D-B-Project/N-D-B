/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { Interaction, Message } from "discord.js";
import Context from "./Context";

export default class BaseCommand {
  public constructor(
    protected client: INDBClient,
    public options: CommandOptions
  ) {}

  async run(
    client: INDBClient,
    context: Context,
    premium?: boolean
  ): Promise<void | Message | Interaction> {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    );
  }
}
