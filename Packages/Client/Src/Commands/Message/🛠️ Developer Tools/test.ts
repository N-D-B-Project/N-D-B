/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { Message } from "discord.js";

export default class TestCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "test",
      aliases: ["t"],
      description: "Command to test things",
      category: "🛠 Developer Tools",
      usage: "",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: [],
        bot: []
      },
      minArgs: 0,
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    message: Message,
    args: Array<string>,
    premium: boolean
  ) {
    console.log("running test command");
    // const player =
    //   (await MusicTools.getPlayer(client, message.guildId, premium)) ||
    //   (await MusicTools.createPlayer(
    //     client,
    //     message.member.voice.channel as VoiceChannel,
    //     message.channelId,
    //     premium
    //   ));

    // await player.connect();
    // const res = await player.search(
    //   {
    //     query: "Star Walkin'",
    //     source: "spotify"
    //   },
    //   client.user
    // );

    // player.queue.add(res.tracks[0]);

    // await player.play({
    //   paused: false,
    //   volume: 50
    // });
  }
}
