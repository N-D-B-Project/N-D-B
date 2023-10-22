/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

import { EventOptions, INDBClient } from "@/Types";
import { BaseCommand, BaseEvent } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";
import { CommandChecker } from "@/Utils/Tools";
import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class SlashCommandEvent extends BaseEvent {
  public constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "SlashCommand",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  public async run(
    client: INDBClient,
    interaction: ChatInputCommandInteraction
  ) {
    const _Command: BaseCommand = client.Collections.SlashCommands.get(
      interaction.commandName
    ) as BaseCommand;
    const cmdTools = new CommandChecker();

    const context = new Context(
      client,
      interaction,
      interaction.options as CommandInteractionOptionResolver,
      "Sub"
    );
    if (_Command) {
      const Checker = await cmdTools.runCheck(context, _Command);
      if (Checker) {
        await interaction.deferReply().catch(e => {});
        _Command.run(context).catch(async (error: Error) => {
          client.logger.error(error.stack);
          return;
        });
      }
    }
  }
}
