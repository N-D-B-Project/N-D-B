import NDBClient from "@/Core/NDBClient";
import {
  CommandInteraction,
  GuildMember,
  Message,
  VoiceChannel
} from "discord.js";
import MusicTools from "./Tools";

export default class Multi {
  public static async _Legacy(message: Message, isPremium: boolean) {
    const client = message.client as NDBClient;
    var player = await MusicTools.getPlayer(client, message.guildId, isPremium);

    if (!player) {
      player = await MusicTools.createPlayer(
        client,
        message.member.voice.channel as VoiceChannel,
        message.channelId,
        isPremium
      );
    }
    if (!(await MusicTools.Checkers(player, { MsgInt: message }, true))) {
      return;
    }

    if (!(await MusicTools.hasVoice({ MsgInt: message }, false))) {
      return;
    }

    if (!player.connected) {
      player.slash = { isSlash: false };
      player.playerAuthor = message.author.id;
      await player.connect();
    }

    if (!(await MusicTools.sameVoice(player, { MsgInt: message }, false))) {
      return;
    }
    return;
  }

  public static async _Slash(
    interaction: CommandInteraction,
    isPremium: boolean
  ) {
    const client = interaction.client as NDBClient;
    var player = await MusicTools.getPlayer(
      client,
      interaction.guildId,
      isPremium
    );
    if (!(await MusicTools.Checkers(player, { MsgInt: interaction }, true))) {
      return;
    }

    if (!(await MusicTools.hasVoice({ MsgInt: interaction }, true))) {
      return;
    }

    if (!player) {
      player = await MusicTools.createPlayer(
        client,
        (interaction.member as GuildMember).voice.channel as VoiceChannel,
        interaction.channelId,
        isPremium
      );
    }

    if (!player.connected) {
      player.slash = { isSlash: true };
      player.playerAuthor = interaction.user.id;
      await player.connect();
    }

    if (!(await MusicTools.sameVoice(player, { MsgInt: interaction }, true))) {
      return;
    }
    return;
  }
}
