import { INDBClient } from "@/Types";
import { BaseSlashCommand } from "@/Utils/Structures";
import { CommandInteraction, TextChannel } from "discord.js";
import { InteractionTools, Tools } from "../index";

export default class SlashChecker {
  public constructor(private client: INDBClient) {
    this.client = client;
  }

  public async runCheck(
    interaction: CommandInteraction,
    _Command: BaseSlashCommand
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = interaction.channel as TextChannel;
    const tools = new Tools(this.client);

    if (Options.ownerOnly && !tools.checkOwner(interaction.user.id)) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          interaction
        ),
        false
      );
      return false;
    }

    if (
      Options.deployMode === "Guild" &&
      !tools.checkGuild(interaction.guild.id)
    ) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:GuildOnly",
          interaction
        ),
        false
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NSFW",
          interaction
        ),
        false
      );
      return false;
    }
    if (Options.disable) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          interaction
        ),
        false
      );
      return false;
    }
    // if (Options.ndcash && !NDCash) {
    //   InteractionTools.reply(
    //     interaction,
    //     await this.client.Translate.Guild(
    //       "Tools/Command:Checker:NDCash",
    //       interaction
    //     )
    //   );
    //   return false;
    // }
    // if (Options.ndcash && NDCash) {
    //   NDCash -= Options.ndcash;
    //   UserProfile.save();
    //   return true;
    // }

    // const player = await MusicTools.getPlayer(this.client, interaction.guildId);
    // if (interaction.channelId !== player.textChannelId) {
    //   const voiceChannel = await interaction.guild.channels.fetch(
    //     player.voiceChannelId
    //   );

    //   await this.client.Translate.Guild(
    //     "Tools/Music:WrongChannel",
    //     interaction,
    //     {
    //       TextChannel: channelMention(player.textChannelId),
    //       VoiceChannel: channelMention(voiceChannel)
    //     }
    //   );
    //   return false;
    // }

    return true;
  }
}
