import NDBClient from "@/Core/NDBClient"
import { BaseSlashCommand } from "@/Utils/Structures"
import { CommandInteraction, TextChannel } from "discord.js"
import { InteractionTools, Tools } from "../index"

export default class SlashChecker {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  public async runCheck(
    interaction: CommandInteraction,
    _Command: BaseSlashCommand
  ): Promise<boolean> {
    const Options = _Command.options
    const Channel = interaction.channel as TextChannel
    const tools = new Tools(this.client)

    if (Options.ownerOnly && !tools.checkOwner(interaction.user.id)) {
      console.log("Owner")
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          interaction
        )
      )
      return false
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
        )
      )
      return false
    }
    if (Options.nsfw && !Channel.nsfw) {
      console.log("NSFW")
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NSFW",
          interaction
        )
      )
      return false
    }
    if (Options.disable) {
      console.log("Disable")
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          interaction
        )
      )
      return false
    }
    // if (Options.ndcash && !NDCash) {
    //   console.log("NDCash");
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
    //   console.log("NDCash_2");
    //   NDCash -= Options.ndcash;
    //   UserProfile.save();
    //   return true;
    // }

    return true
  }
}
