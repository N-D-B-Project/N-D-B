/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { Message } from "discord.js";

export default class BaseCommand {
  public constructor(
    protected client: INDBClient,
    public options: CommandOptions,
    public args: Array<string>
  ) {}

  async run(
    client: INDBClient,
    message: Message,
    args: Array<string>,
    premium?: boolean
  ): Promise<void> {
    throw new Error(
      `Comando \`${this.options.name}\` Não proveu um método Run!`
    );
  }
}
