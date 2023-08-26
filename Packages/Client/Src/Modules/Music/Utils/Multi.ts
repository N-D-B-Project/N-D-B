/* eslint-disable no-shadow */

import NDBClient from "@/Core/NDBClient";
import { SwitchCommand } from "@/Types";
import { InteractionTools, MessageTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message
} from "discord.js";
import { CommandList } from "../Types";
import MusicTools from "./Tools";

export default class Multi {
  public static async _Legacy(
    message: Message,
    command: CommandList,
    isPremium: boolean,
    args?: Array<string>
  ) {
    const client = message.client as NDBClient;
    const player = await MusicTools.getPlayer(
      client,
      message.guildId,
      isPremium
    );
    if (!(await MusicTools.Checkers(player, { MsgInt: message }, false))) {
      return;
    }

    return MessageTools.reply(
      message,
      await this.Switch(command, { MsgInt: message, args }, false, isPremium)
    );
  }

  public static async _Slash(
    interaction: CommandInteraction,
    command: CommandList,
    isPremium: boolean,

    args?: CommandInteractionOptionResolver
  ) {
    const client = interaction.client as NDBClient;
    const player = await MusicTools.getPlayer(
      client,
      interaction.guildId,
      isPremium
    );
    if (!(await MusicTools.Checkers(player, { MsgInt: interaction }, true))) {
      return;
    }

    return InteractionTools.reply(
      interaction,
      await this.Switch(
        command,
        { MsgInt: interaction, args },
        false,
        isPremium
      ),
      false
    );
  }

  private static async Switch(
    command: CommandList,
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean,
    isPremium: boolean
  ): Promise<string> {
    const client = MsgInt.client as NDBClient;
    const player = await MusicTools.getPlayer(
      client,
      MsgInt.guildId,
      isPremium
    );
    const VoiceChannel = (
      await MsgInt.guild.channels.fetch(player.voiceChannelId)
    ).name;
    switch (command) {
      case CommandList.skip:
      // player.
      case CommandList.stop:
        player.pause();
        player.skip();
        return await client.Translate.Guild("Tools/Music:Stop", MsgInt);

      case CommandList.leave:
        player.disconnect();
        player.destroy();
        return await client.Translate.Guild("Tools/Music:Leave", MsgInt, {
          VoiceChannel
        });

      case CommandList.pause:
        player.pause();
        return;

      case CommandList.resume:
        player.resume();
        return;

      case CommandList.shuffle:
        if (!player.isShuffle) {
          player.originalQueue = player.queue;
        }
        player.queue.shuffle();
        player.isShuffle = true;
        return;

      case CommandList.unshuffle:
        player.queue.utils.destroy();
        player.queue.add(player.originalQueue.tracks);
        player.isShuffle = false;
        return;

      case CommandList.loop:
        return;

      case CommandList.volume:
        const volume = Number(
          isSlash
            ? (args as CommandInteractionOptionResolver).get("volume")
            : (args as Array<string>)[0]
        );
        if (!volume || volume < 1 || volume > 100) {
          return await client.Translate.Guild(
            "Tools/Music:Volume:NotValid",
            MsgInt
          );
        }

        player.setVolume(volume);
        return await client.Translate.Guild(
          "Tools/Music:Volume:NotValid",
          MsgInt,
          {
            volume
          }
        );
    }
  }
}
