/* eslint-disable no-shadow */

import NDBClient from "@/Core/NDBClient";
import { SwitchCommand } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message
} from "discord.js";
import { MultiCommandList } from "../Types";
import MusicTools from "./Tools";

export default class Multi {
  public static async _Legacy(
    message: Message,
    command: MultiCommandList,
    isPremium: boolean,
    args?: Array<string>
  ) {
    return await this.Switch(
      command,
      { MsgInt: message, args },
      false,
      isPremium
    );
  }

  public static async _Slash(
    interaction: CommandInteraction,
    command: MultiCommandList,
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

    return (
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
    command: MultiCommandList,
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
      case MultiCommandList.skip:
        const skipAmount =
          Number(
            isSlash
              ? (args as CommandInteractionOptionResolver).get("skip_amount")
              : (args as Array<string>)[0]
          ) || 0;
        var SkipSTR = "";
        if (skipAmount === 0) {
          SkipSTR = "Tools/Music:Skip:Current";
        } else {
          SkipSTR = "Tools/Music:Skip:Amount";
        }
        player.skip(skipAmount);
        return await client.Translate.Guild(SkipSTR, MsgInt, { skipAmount });
      case MultiCommandList.stop:
        player.destroy();
        return await client.Translate.Guild("Tools/Music:Stop", MsgInt);

      case MultiCommandList.leave:
        player.disconnect();
        return await client.Translate.Guild("Tools/Music:Leave", MsgInt, {
          VoiceChannel
        });

      case MultiCommandList.pause:
        player.pause();
        return;

      case MultiCommandList.resume:
        player.resume();
        return;

      case MultiCommandList.shuffle:
        if (!player.isShuffle) {
          player.originalQueue = player.queue;
        }
        player.queue.shuffle();
        player.isShuffle = true;
        return;

      case MultiCommandList.unshuffle:
        player.queue.utils.destroy();
        player.queue.add(player.originalQueue.tracks);
        player.isShuffle = false;
        return;

      case MultiCommandList.loop:
        return;

      case MultiCommandList.volume:
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
          "Tools/Music:Volume:Defined",
          MsgInt,
          {
            volume
          }
        );
    }
  }
}
