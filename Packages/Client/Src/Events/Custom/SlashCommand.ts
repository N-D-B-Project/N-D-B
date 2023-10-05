/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */

import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent, BaseSlashCommand } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";
import { SlashTools } from "@/Utils/Tools";
import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class SlashCommandEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "SlashCommand",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, interaction: ChatInputCommandInteraction) {
    const cmdTools = new SlashTools(client);
    const { Premium } = (
      await client.database.GuildRepo.get(interaction.guildId)
    ).Settings;

    const _Command: BaseSlashCommand = client.Collections.SlashCommands.get(
      interaction.commandName
    ) as BaseSlashCommand;
    const context = new Context(
      interaction,
      interaction.options as CommandInteractionOptionResolver
    );

    if (_Command) {
      const Checker = await cmdTools.runCheck(interaction, _Command);

      if (Checker) {
        await interaction.deferReply().catch(e => {});

        _Command.run(client, context, Premium).catch(async (error: Error) => {
          client.logger.error(error.stack);
          return;
        });
      }
    }
  }
}
