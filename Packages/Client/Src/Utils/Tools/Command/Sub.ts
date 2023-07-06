import NDBClient from "@/Core/NDBClient"
import { BaseSubCommand } from "@/Utils/Structures"
import { CommandInteraction, TextChannel } from "discord.js"
import { InteractionTools, Tools } from "../index"

export default class SubChecker {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  public async runCheck(
    interaction: CommandInteraction,
    _Command: BaseSubCommand
  ): Promise<boolean> {
    const Options = _Command.options
    const Channel = interaction.channel as TextChannel
    const tools = new Tools(this.client)

    if (Options.ownerOnly && !tools.checkOwner(interaction.user.id)) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          interaction
        ),
        true
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
        ),
        true
      )
      return false
    }
    if (Options.nsfw && !Channel.nsfw) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NSFW",
          interaction
        ),
        true
      )
      return false
    }
    if (Options.disable) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          interaction
        ),
        true
      )
      return false
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

    return true
  }
}
