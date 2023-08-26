import NDBClient from "@/Core/NDBClient";
import Music from "@/Modules/Music";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { Message } from "discord.js";

export default class NowPlayingCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "NowPlaying",
      aliases: ["nowplaying", "np", "NP"],
      description: "",
      category: "🎵 Music",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"]
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(
    client: NDBClient,
    message: Message,
    args: Array<string>,
    premium: boolean
  ) {
    const music = new Music(client);
    const nowplaying = await music.NowPlaying(
      { MsgInt: message },
      false,
      premium
    );
    await MessageTools.reply(message, nowplaying);
  }
}
