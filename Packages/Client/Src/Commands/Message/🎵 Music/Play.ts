import NDBClient from "@/Core/NDBClient";
import Music from "@/Modules/Music";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { Message } from "discord.js";

export default class PlayCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "Play",
      aliases: ["play", "p", "P"],
      description: "Search a Song and Play it on a Voice Channel",
      category: "🎵 Music",
      usage: "<query>",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"]
      },
      minArgs: 1,
      maxArgs: 1000,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    message: Message,
    args: Array<string>,
    premium: boolean
  ) {
    const music = new Music(client);
    const play = await music.Play({ MsgInt: message, args }, false, premium);
    MessageTools.reply(message, play);
  }
}
