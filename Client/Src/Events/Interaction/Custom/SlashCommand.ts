import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { CommandTools, InteractionTools } from "~/Utils/Tools";
import BaseEvent from "@Structures/BaseEvent";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";

module.exports = class SlashCommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SlashCommand",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    UserProfile: Mongoose.Document
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
        "message",
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
          interaction.options as Discord.CommandInteractionOptionResolver
        );
      }
    }
  }
};
