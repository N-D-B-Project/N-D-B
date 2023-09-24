import Music from "@/Modules/Music";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { Message } from "discord.js";

export default class JoinCommand extends BaseCommand {
  constructor(client: INDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "join",
      aliases: ["Join"],
      description: "Join's a voice channel",
      category: "🎵 Music",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"]
      },
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    message: Message,
    args: Array<string>,
    premium: boolean
  ) {
    await new Music(client).Join({ MsgInt: message }, false, premium);
  }
}
