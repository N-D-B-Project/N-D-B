import NDBClient from "@/Core/NDBClient";
import { InteractionTools, MessageTools } from "@/Utils/Tools";
import { CommandInteraction, Message } from "discord.js";
import MusicEmbeds from "./Embeds";
import MusicTools from "./Tools";

export default class NowPlaying {
  public static async _Legacy(message: Message, isPremium: boolean) {
    const client = message.client as NDBClient;
    const player = await MusicTools.getPlayer(
      client,
      message.guildId,
      isPremium
    );
    if (
      !(await MusicTools.HasPlayer(
        player,
        client,
        {
          MsgInt: message
        },
        false
      ))
    ) {
      return;
    }

    return MessageTools.reply(
      message,
      await new MusicEmbeds(message.client as NDBClient).NowPlaying(
        message,
        isPremium
      )
    );
  }

  public static async _Slash(
    interaction: CommandInteraction,
    isPremium: boolean
  ) {
    const client = interaction.client as NDBClient;
    const player = await MusicTools.getPlayer(
      client,
      interaction.guildId,
      isPremium
    );
    if (
      !(await MusicTools.HasPlayer(
        player,
        client,
        {
          MsgInt: interaction
        },
        false
      ))
    ) {
      return;
    }

    return InteractionTools.reply(
      interaction,
      await new MusicEmbeds(interaction.client as NDBClient).NowPlaying(
        interaction,
        isPremium
      ),
      false
    );
  }
}
