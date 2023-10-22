/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";
import { Paginator } from "@/Utils/Tools";
import { EmbedBuilder } from "discord.js";

export default class TestCommand extends BaseCommand {
  constructor(client: INDBClient) {
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
        bot: [],
        guildOnly: false,
        ownerOnly: true
      },
      minArgs: 0,
      nsfw: false,
      ndcash: 0,
      slash: {
        type: "Sub",
        name: "test"
      }
    };
    super(client, options);
  }

  async run(context: Context) {
    console.log(context);
    const embeds = [];
    for (let i = 0; i < 10; i++) {
      embeds.push(new EmbedBuilder().setDescription(`Embed: ${i + 1}`));
    }
    return await Paginator(context, embeds);
  }
}
