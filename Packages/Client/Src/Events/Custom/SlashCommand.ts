import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { SlashTools, InteractionTools } from "~/Utils/Tools";
import { BaseEvent, BaseSlashCommand } from "@Utils/Structures";
import {
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  Interaction,
  User,
} from "discord.js";

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

  async run(client: NDBClient, interaction: ChatInputCommandInteraction) {
    const UserProfile = await client.Mongoose.FindUserProfile(
      interaction.member.user as User
    );
    if (!UserProfile) {
      await client.Mongoose.CreateUserProfile(
        interaction as Interaction,
        interaction.user
      );
    }
    await client.Mongoose.AddGuildToProfile(
      interaction as Interaction,
      interaction.user
    );
    const cmdTools = new SlashTools(client);

    const _Command: BaseSlashCommand = client.Collections.SlashCommands.get(
      interaction.commandName
    ) as BaseSlashCommand;

    if (_Command) {
      const Checker = await cmdTools.runCheck(
        interaction,
        _Command,
        UserProfile
      );

      if (Checker) {
        await interaction.deferReply().catch((e) => {});

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
};
