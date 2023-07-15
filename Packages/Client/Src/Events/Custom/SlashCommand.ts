/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent, BaseSlashCommand } from "@/Utils/Structures";
import { SlashTools } from "@/Utils/Tools";
import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class SlashCommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SlashCommand",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: ChatInputCommandInteraction) {
    const cmdTools = new SlashTools(client);

    const _Command: BaseSlashCommand = client.Collections.SlashCommands.get(
      interaction.commandName
    ) as BaseSlashCommand;

    if (_Command) {
      const Checker = await cmdTools.runCheck(interaction, _Command);

      if (Checker) {
        await interaction.deferReply().catch(e => {});

        _Command
          .run(
            client,
            interaction,
            interaction.options as CommandInteractionOptionResolver
          )
          .catch(async (error: Error) => {
            client.logger.error(error.stack);
            return;
          });
      }
    }
  }
}
