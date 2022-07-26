import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { CommandTools, InteractionTools } from "~/Utils/Tools";
import { BaseEvent, BaseCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { Document } from "mongoose";

module.exports = class SlashCommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SlashCommand",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    UserProfile: Document
  ) {
    const cmdTools = new CommandTools(client);
    const guild = client.guilds.cache.get(interaction.guildId);

    const _Command: BaseCommand = client.Collections.commands.get(
      interaction.commandName
    ) as BaseCommand;

    if (_Command) {
      const Checker = await cmdTools.runCheck(
        interaction,
        _Command,
        "interaction",
        UserProfile
      );

      if (Checker) {
        await interaction
          .deferReply({
            ephemeral: _Command.options.SlashOptions.ephemeral,
          })
          .catch(() => {});

        await _Command.SlashRun(
          client,
          interaction,
          interaction.options as CommandInteractionOptionResolver
        );
      }
    }
  }
};
