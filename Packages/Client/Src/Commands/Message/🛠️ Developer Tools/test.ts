/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools, Paginator } from "@/Utils/Tools";
import { EmbedBuilder, Message } from "discord.js";

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
      minArgs: 2,
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const msg = await MessageTools.send(message.channel, {
      content: await client.Translate.Guild(
        "DeveloperTools/test:Test",
        message
      ),
      embeds: [],
      components: []
    });

    await client.Tools.WAIT(1500);

    MessageTools.edit(
      msg,
      await client.Translate.Guild("DeveloperTools/test:Tested", message)
    );

    const TestEmbeds: Array<EmbedBuilder> = [
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("DeveloperTools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "1" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("DeveloperTools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "2" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("DeveloperTools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "3" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("DeveloperTools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "4" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("DeveloperTools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "5" })
    ];

    await Paginator(client, message, "Message", TestEmbeds);
  }
}
